import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MODEL_CATALOG = {
  showcase: {
    file: 'katze-showcase-animated.glb',
    label: 'Animación 3-en-1',
    desc: 'KatzeFullShowcase · 24 s (Eco → Katze → Odoo)',
    animated: true,
    cameraZ: 2.38,
  },
  katze: {
    file: 'katze.glb',
    label: 'Katze',
    desc: 'Isotipo Katze completo (Contorno felino + Eco)',
    animated: false,
    cameraZ: 1.75,
  },
  eco: {
    file: 'eco.glb',
    label: 'Eco',
    desc: 'Emblema geométrico de ingeniería interno',
    animated: false,
    cameraZ: 1.55,
  },
  odoo: {
    file: 'odoo.glb',
    label: 'Odoo',
    desc: 'Wordmark 3D Odoo Ready Partner',
    animated: false,
    cameraZ: 2.15,
  },
  'odoo-o': {
    file: 'odoo-o.glb',
    label: 'Odoo O',
    desc: 'Emblema modular Odoo',
    animated: false,
    cameraZ: 1.65,
  },
};

const PRESETS = {
  graphite: {
    envIntensity: 0.72,
    ambient: { color: 0x3b2c54, intensity: 1.15 },
    key: { color: 0xf4f1ff, intensity: 2.6, pos: [2.6, 3.2, 3.4] },
    rimLeft: { color: 0x9b5de5, intensity: 4.2, pos: [-3.2, 1.4, -2.0] },
    rimRight: { color: 0xd16fff, intensity: 2.9, pos: [2.8, -1.6, -2.4] },
    darkMat: { color: 0x22202d, metalness: 0.48, roughness: 0.32, envMapIntensity: 1.25 },
    odooPurple: { color: 0x714b67, metalness: 0.25, roughness: 0.36 },
    odooGray: { color: 0x9c9ca6, metalness: 0.28, roughness: 0.38 },
  },
  obsidian: {
    envIntensity: 0.85,
    ambient: { color: 0x4b2a73, intensity: 1.3 },
    key: { color: 0xf8efff, intensity: 2.4, pos: [2.4, 3.0, 3.2] },
    rimLeft: { color: 0xd16fff, intensity: 5.0, pos: [-3.0, 1.8, -1.8] },
    rimRight: { color: 0x9b5de5, intensity: 4.2, pos: [3.0, -1.4, -2.2] },
    darkMat: { color: 0x2b1945, metalness: 0.62, roughness: 0.22, envMapIntensity: 1.45 },
    odooPurple: { color: 0x86567a, metalness: 0.32, roughness: 0.3 },
    odooGray: { color: 0xb0a7c2, metalness: 0.32, roughness: 0.32 },
  },
  atelier: {
    envIntensity: 0.65,
    ambient: { color: 0xf6f3fa, intensity: 1.75 },
    key: { color: 0xffffff, intensity: 2.5, pos: [2.8, 3.8, 3.2] },
    rimLeft: { color: 0x9b5de5, intensity: 1.9, pos: [-3.0, 1.4, -2.0] },
    rimRight: { color: 0x5c3c8a, intensity: 1.2, pos: [2.5, -1.8, -1.6] },
    darkMat: { color: 0x1e182b, metalness: 0.16, roughness: 0.5, envMapIntensity: 0.9 },
    odooPurple: { color: 0x714b67, metalness: 0.14, roughness: 0.42 },
    odooGray: { color: 0x7b7885, metalness: 0.14, roughness: 0.44 },
  },
  'atelier-dark': {
    envIntensity: 0.78,
    ambient: { color: 0x412d60, intensity: 1.25 },
    key: { color: 0xf7f4ff, intensity: 2.6, pos: [2.6, 3.4, 3.2] },
    rimLeft: { color: 0xd16fff, intensity: 4.0, pos: [-3.0, 1.5, -2.0] },
    rimRight: { color: 0x9b5de5, intensity: 3.1, pos: [2.8, -1.5, -2.2] },
    darkMat: { color: 0x261d38, metalness: 0.44, roughness: 0.32, envMapIntensity: 1.25 },
    odooPurple: { color: 0x7d5372, metalness: 0.25, roughness: 0.35 },
    odooGray: { color: 0xa29eb0, metalness: 0.25, roughness: 0.38 },
  },
};

const TEXTURE_KEYS = [
  'map',
  'normalMap',
  'roughnessMap',
  'metalnessMap',
  'emissiveMap',
  'aoMap',
  'alphaMap',
  'bumpMap',
  'displacementMap',
  'envMap',
];

function resolveModelUrl(basePath, fileName) {
  const cleanBase = String(basePath || './models/').replace(/\/+$/, '');
  return `${cleanBase}/${fileName}`;
}

function createRendererAndCamera(container, initialCameraZ) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100);
  camera.position.set(0.24, 0.14, initialCameraZ);
  return { renderer, camera };
}

function createStudioEnvironment(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envTex = pmrem.fromScene(roomEnv, 0.04).texture;
  roomEnv.dispose();
  scene.environment = envTex;
  return { pmrem, envTex };
}

function createOrbitControls(camera, domElement, onDragChange) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.78;
  controls.addEventListener('start', () => onDragChange(true));
  controls.addEventListener('end', () => onDragChange(false));
  return controls;
}

function createStageLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  const rimLeft = new THREE.PointLight(0x9b5de5, 4, 12);
  const rimRight = new THREE.PointLight(0xd16fff, 3, 12);
  scene.add(ambientLight, keyLight, rimLeft, rimRight);
  return { ambientLight, keyLight, rimLeft, rimRight };
}

function applyModelMaterials(root, preset) {
  if (!root) return;
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    materials.forEach((mat) => {
      const name = (mat.name || '').toLowerCase();
      if (name.includes('odoopurple')) {
        mat.color.setHex(preset.odooPurple.color);
        mat.metalness = preset.odooPurple.metalness;
        mat.roughness = preset.odooPurple.roughness;
      } else if (name.includes('odoogray')) {
        mat.color.setHex(preset.odooGray.color);
        mat.metalness = preset.odooGray.metalness;
        mat.roughness = preset.odooGray.roughness;
      } else {
        mat.color.setHex(preset.darkMat.color);
        mat.metalness = preset.darkMat.metalness;
        mat.roughness = preset.darkMat.roughness;
        mat.envMapIntensity = preset.darkMat.envMapIntensity;
      }
      mat.needsUpdate = true;
    });
  });
}

function applyStagePreset(scene, lights, currentGroup, presetName) {
  const preset = PRESETS[presetName] || PRESETS.graphite;
  scene.environmentIntensity = preset.envIntensity;

  lights.ambientLight.color.setHex(preset.ambient.color);
  lights.ambientLight.intensity = preset.ambient.intensity;

  lights.keyLight.color.setHex(preset.key.color);
  lights.keyLight.intensity = preset.key.intensity;
  lights.keyLight.position.set(...preset.key.pos);

  lights.rimLeft.color.setHex(preset.rimLeft.color);
  lights.rimLeft.intensity = preset.rimLeft.intensity;
  lights.rimLeft.position.set(...preset.rimLeft.pos);

  lights.rimRight.color.setHex(preset.rimRight.color);
  lights.rimRight.intensity = preset.rimRight.intensity;
  lights.rimRight.position.set(...preset.rimRight.pos);

  applyModelMaterials(currentGroup, preset);
}

function disposeMaterial(material) {
  if (!material) return;
  TEXTURE_KEYS.forEach((key) => {
    material[key]?.dispose?.();
  });
  material.dispose?.();
}

function disposeObject3D(root) {
  if (!root) return;
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    obj.geometry?.dispose?.();
    if (Array.isArray(obj.material)) {
      obj.material.forEach(disposeMaterial);
    } else if (obj.material) {
      disposeMaterial(obj.material);
    }
  });
}

function fitAndNormalizeModel(key, gltfScene) {
  const pivot = new THREE.Group();
  gltfScene.position.set(0, 0, 0);
  gltfScene.scale.setScalar(1);
  gltfScene.updateMatrixWorld(true);

  if (key === 'showcase') {
    gltfScene.scale.setScalar(1.02);
    pivot.add(gltfScene);
    return pivot;
  }

  const box = new THREE.Box3().setFromObject(gltfScene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const targetScale = 0.98 / maxDim;
  gltfScene.position.sub(center);
  gltfScene.scale.setScalar(targetScale);
  pivot.add(gltfScene);
  return pivot;
}

function collectStageUi(container) {
  const wrapper = container.closest('[data-stage-wrapper]') || container.parentElement;
  return {
    wrapper,
    statusEl: wrapper?.querySelector('[data-stage-status]') || null,
    captionEl: wrapper?.querySelector('[data-stage-caption]') || null,
    progressBar: wrapper?.querySelector('[data-stage-progress]') || null,
    timeEl: wrapper?.querySelector('[data-stage-time]') || null,
    playBtn: wrapper?.querySelector('[data-stage-play]') || null,
    timelineWrap: wrapper?.querySelector('[data-stage-timeline]') || null,
    modelButtons: wrapper ? [...wrapper.querySelectorAll('[data-model-key]')] : [],
  };
}

function setStageStatus(ui, text, hidden = false) {
  if (!ui.statusEl) return;
  ui.statusEl.textContent = text;
  ui.statusEl.style.opacity = hidden ? '0' : '1';
  ui.statusEl.style.pointerEvents = hidden ? 'none' : 'auto';
}

function updateStageUi(ui, state) {
  ui.modelButtons.forEach((btn) => {
    const isActive = btn.dataset.modelKey === state.activeModelKey;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  const entry = MODEL_CATALOG[state.activeModelKey];
  if (ui.playBtn) {
    ui.playBtn.style.display = entry?.animated ? 'inline-flex' : 'none';
    ui.playBtn.textContent = state.isPlaying ? '❚❚ Pausar' : '▶ Reproducir';
  }
  if (ui.timelineWrap) {
    ui.timelineWrap.style.opacity = entry?.animated ? '1' : '0.35';
  }
  if (!entry?.animated) {
    if (ui.progressBar) ui.progressBar.style.width = '0%';
    if (ui.timeEl) ui.timeEl.textContent = '0.0s / 0.0s';
  }
}

function bindStageUi(ui, handlers, signal) {
  ui.modelButtons.forEach((btn) => {
    btn.addEventListener(
      'click',
      () => handlers.onSelectModel(btn.dataset.modelKey),
      { signal }
    );
  });
  if (ui.playBtn) {
    ui.playBtn.addEventListener('click', handlers.onTogglePlay, { signal });
  }
}

function clearStageModel(state, scene) {
  if (state.currentGroup) {
    scene.remove(state.currentGroup);
    state.currentGroup = null;
  }
  if (state.currentMixer) {
    state.currentMixer.stopAllAction();
    state.currentMixer.uncacheRoot(state.currentMixer.getRoot());
    state.currentMixer = null;
    state.currentAction = null;
  }
}

function mountStageModel(ctx, key, gltf) {
  const { state, scene, camera, controls, ui, cameraZ } = ctx;
  if (state.destroyed) return;
  clearStageModel(state, scene);

  const entry = MODEL_CATALOG[key];
  const pivot = fitAndNormalizeModel(key, gltf.scene);
  const preset = PRESETS[state.activePresetName] || PRESETS.graphite;
  applyModelMaterials(pivot, preset);

  scene.add(pivot);
  state.currentGroup = pivot;

  const camZ = cameraZ ?? entry.cameraZ ?? 2.38;
  camera.position.set(0.24, 0.14, camZ);
  controls.target.set(0, 0, 0);
  controls.update();

  if (gltf.animations && gltf.animations.length > 0) {
    state.currentMixer = new THREE.AnimationMixer(gltf.scene);
    const clip = gltf.animations[0];
    state.currentDuration = clip.duration || 24;
    state.currentAction = state.currentMixer.clipAction(clip);
    state.currentAction.reset().play();
    state.currentAction.paused = !state.isPlaying;
  }

  if (ui.captionEl) ui.captionEl.textContent = entry.desc;
  setStageStatus(ui, '', true);
  updateStageUi(ui, state);
}

function loadStageModel(ctx, name) {
  const { state, ui, gltfCache, loader, modelBasePath } = ctx;
  if (state.destroyed) return;
  const entry = MODEL_CATALOG[name];
  if (!entry) return;

  const token = ++state.loadToken;
  state.activeModelKey = name;
  updateStageUi(ui, state);

  if (gltfCache.has(name)) {
    mountStageModel(ctx, name, gltfCache.get(name));
    return;
  }

  setStageStatus(ui, `Cargando ${entry.label} 3D...`, false);
  loader.load(
    resolveModelUrl(modelBasePath, entry.file),
    (gltf) => {
      if (state.destroyed) {
        disposeObject3D(gltf.scene);
        return;
      }
      gltfCache.set(name, gltf);
      if (token === state.loadToken) {
        mountStageModel(ctx, name, gltf);
      }
    },
    undefined,
    (err) => {
      if (state.destroyed || token !== state.loadToken) return;
      console.error('Error cargando GLB:', err);
      setStageStatus(ui, 'No se pudo cargar el modelo 3D.', false);
    }
  );
}

function resizeStage(ctx) {
  if (ctx.state.destroyed) return;
  const rect = ctx.container.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return;
  ctx.camera.aspect = rect.width / rect.height;
  ctx.camera.updateProjectionMatrix();
  ctx.renderer.setSize(rect.width, rect.height, false);
}

function createStageAnimationLoop(ctx) {
  const { state, ui, controls, renderer, scene, camera } = ctx;
  const clock = new THREE.Clock();
  let rafId = 0;

  function animate() {
    if (state.destroyed) return;
    rafId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    if (state.currentMixer && state.isPlaying) {
      state.currentMixer.update(delta);
      if (state.currentAction && ui.progressBar) {
        const t = state.currentAction.time % state.currentDuration;
        ui.progressBar.style.width = `${(t / state.currentDuration) * 100}%`;
        if (ui.timeEl) {
          ui.timeEl.textContent = `${t.toFixed(1).padStart(4, '0')}s / ${state.currentDuration.toFixed(0)}s`;
        }
      }
    }

    if (state.currentGroup) {
      state.currentGroup.position.y = Math.sin(elapsed * 1.4) * 0.022;
      if (!MODEL_CATALOG[state.activeModelKey]?.animated && !state.userDragging) {
        state.currentGroup.rotation.y += delta * 0.55;
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
  return () => cancelAnimationFrame(rafId);
}

function disposeStage(ctx, stopLoop, ro, abortController) {
  const { state, scene, gltfCache, controls, envTex, pmrem, renderer } = ctx;
  if (state.destroyed) return;
  state.destroyed = true;
  state.loadToken += 1;
  stopLoop();
  ro.disconnect();
  abortController.abort();

  clearStageModel(state, scene);
  for (const gltf of gltfCache.values()) {
    disposeObject3D(gltf.scene);
  }
  gltfCache.clear();

  controls.dispose();
  envTex.dispose();
  pmrem.dispose();
  scene.environment = null;
  renderer.dispose();
  renderer.forceContextLoss?.();
  renderer.domElement.remove();
}

function createStageState(initialModel, presetName) {
  return {
    activeModelKey: initialModel,
    activePresetName: presetName || 'graphite',
    isPlaying: true,
    userDragging: false,
    destroyed: false,
    loadToken: 0,
    currentGroup: null,
    currentMixer: null,
    currentAction: null,
    currentDuration: 24,
  };
}

function createStageContext(container, options) {
  const initialModel = MODEL_CATALOG[options.initialModel]
    ? options.initialModel
    : 'showcase';
  const state = createStageState(initialModel, options.preset);
  const ui = collectStageUi(container);
  const { renderer, camera } = createRendererAndCamera(
    container,
    options.cameraZ ?? MODEL_CATALOG[initialModel].cameraZ
  );
  const scene = new THREE.Scene();
  const { pmrem, envTex } = createStudioEnvironment(renderer, scene);
  const controls = createOrbitControls(camera, renderer.domElement, (dragging) => {
    state.userDragging = dragging;
  });
  const lights = createStageLights(scene);
  applyStagePreset(scene, lights, null, state.activePresetName);

  return {
    initialModel,
    container,
    state,
    ui,
    renderer,
    camera,
    scene,
    pmrem,
    envTex,
    controls,
    loader: new GLTFLoader(),
    gltfCache: new Map(),
    modelBasePath: options.modelBasePath || './models/',
    cameraZ: options.cameraZ,
  };
}

export function initThreeStage(container, options = {}) {
  if (!container) return null;

  const ctx = createStageContext(container, options);
  const abortController = new AbortController();
  const setModel = (name) => loadStageModel(ctx, name);
  const resize = () => resizeStage(ctx);

  bindStageUi(
    ctx.ui,
    {
      onSelectModel: setModel,
      onTogglePlay: () => {
        ctx.state.isPlaying = !ctx.state.isPlaying;
        if (ctx.state.currentAction) ctx.state.currentAction.paused = !ctx.state.isPlaying;
        updateStageUi(ctx.ui, ctx.state);
      },
    },
    abortController.signal
  );

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const stopLoop = createStageAnimationLoop(ctx);
  setModel(ctx.initialModel);

  return {
    setModel,
    resize,
    destroy: () => disposeStage(ctx, stopLoop, ro, abortController),
  };
}
