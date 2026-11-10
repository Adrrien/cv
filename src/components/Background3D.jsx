import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const COLS = 140
const ROWS = 160
const SPACING = 2.5

const vert = /* glsl */`
uniform float u_time;
uniform vec2 u_mouseWorld;
varying float v_wave;
varying float v_influence;
varying float v_edge;

void main() {
  float x = position.x;
  float z = position.z;

  float wave =
      sin(x * 0.016 + u_time * 0.52) * 3.4
    + cos(z * 0.013 + u_time * 0.37) * 2.7
    + sin((x + z) * 0.0095 + u_time * 0.44) * 1.9
    + cos(x * 0.009 - z * 0.011 + u_time * 0.28) * 1.4
    + sin(x * 0.005 + z * 0.007 + u_time * 0.19) * 0.9;

  float dx = x - u_mouseWorld.x;
  float dz = z - u_mouseWorld.y;
  float dist = length(vec2(dx, dz));
  float inf = 1.0 - smoothstep(0.0, 40.0, dist);
  inf = inf * inf * (3.0 - 2.0 * inf);

  /* Edge fade — smooth dissolve on all 4 borders */
  float xFade = 1.0 - smoothstep(130.0, 175.0, abs(x));
  float zMin = -310.0; float zMax = 90.0;
  float zMid = (zMin + zMax) * 0.5;
  float zHalf = (zMax - zMin) * 0.5;
  float zFade = 1.0 - smoothstep(0.72, 1.0, abs(z - zMid) / zHalf);
  v_edge = xFade * zFade;

  v_wave = clamp((wave + 10.5) / 21.0, 0.0, 1.0);
  v_influence = inf;

  vec3 pos = vec3(x, wave - inf * 15.0, z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.2 + inf * 4.0;
}
`

const frag = /* glsl */`
uniform vec3 u_colorBase;
uniform vec3 u_colorAccent;
uniform float u_opacity;
varying float v_wave;
varying float v_influence;
varying float v_edge;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float soft = 1.0 - smoothstep(0.25, 0.5, d);

  vec3 col = mix(u_colorBase, u_colorAccent, v_influence * 0.9);
  float a = (0.22 + v_wave * 0.58 + v_influence * 0.56) * u_opacity * soft * v_edge;
  gl_FragColor = vec4(col, a);
}
`

export default function Background3D({ theme }) {
  const mountRef = useRef(null)
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let cancelled = false
    const W = window.innerWidth
    const H = window.innerHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera — angled to see the 3D wave terrain
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 2000)
    camera.position.set(0, 60, 108)
    camera.lookAt(0, 0, -18)

    // Renderer — Three.js creates its own canvas element
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    } catch {
      return
    }
    if (cancelled) { renderer.dispose(); return }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.setSize(W, H)
    renderer.setClearColor(0, 0)
    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: 0, left: 0, display: 'block', pointerEvents: 'none',
    })
    mount.appendChild(renderer.domElement)

    // Grid geometry — COLS × ROWS points on the XZ plane
    const count = COLS * ROWS
    const positions = new Float32Array(count * 3)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c
        positions[i * 3]     = (c - COLS / 2) * SPACING
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = (r - ROWS / 2) * SPACING - 110
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Shader uniforms — mouse starts far off-grid so no initial orange blob
    const uniforms = {
      u_time:        { value: 0 },
      u_mouseWorld:  { value: new THREE.Vector2(9999, 9999) },
      u_colorBase:   { value: new THREE.Color(0x4899D0) },
      u_colorAccent: { value: new THREE.Color(0xE8520B) },
      u_opacity:     { value: theme === 'dark' ? 1.0 : 0.6 },
    }

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
    })

    scene.add(new THREE.Points(geo, mat))

    // Mouse → world-space via ray–plane intersection
    const raycaster = new THREE.Raycaster()
    const ndcMouse = new THREE.Vector2(0, 0)
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const worldPt = new THREE.Vector3()
    const targetMouse = new THREE.Vector2(9999, 9999)

    const onMouseMove = (e) => {
      ndcMouse.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Animation loop
    let raf
    const timer = new THREE.Timer()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      timer.update()
      const t = timer.getElapsed()
      uniforms.u_time.value = t

      // Smooth mouse follow in world space
      raycaster.setFromCamera(ndcMouse, camera)
      if (raycaster.ray.intersectPlane(groundPlane, worldPt)) {
        targetMouse.set(worldPt.x, worldPt.z)
      }
      uniforms.u_mouseWorld.value.lerp(targetMouse, 0.07)

      // Scroll-based camera parallax
      const scroll = window.scrollY
      camera.position.y = 60 + scroll * 0.012
      camera.lookAt(0, scroll * 0.006, -18)

      // Smooth theme opacity transition
      const isDark = themeRef.current === 'dark'
      const targetOpacity = isDark ? 1.0 : 0.52
      uniforms.u_opacity.value += (targetOpacity - uniforms.u_opacity.value) * 0.04

      // Adjust base color for light mode readability
      if (isDark) {
        uniforms.u_colorBase.value.set(0x4899D0)
      } else {
        uniforms.u_colorBase.value.set(0x1f5c8a)
      }

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const W = window.innerWidth, H = window.innerHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      geo.dispose()
      mat.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.forceContextLoss()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '65%',
        background: 'linear-gradient(to bottom, var(--bg) 0%, var(--bg) 15%, color-mix(in srgb, var(--bg) 70%, transparent) 45%, color-mix(in srgb, var(--bg) 20%, transparent) 75%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Left fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: '12%',
        background: 'linear-gradient(to right, var(--bg), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Right fade */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '12%',
        background: 'linear-gradient(to left, var(--bg), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />
    </div>
  )
}
