# Unofficial Vivify Document

This document is not official, and is only based on observation.

In order to let Vivify load your assets, export them to bundles in Unity 2021.3 and rename the file to `bundleWindows2021.vivify`. Place the file at the beatmap folder and it will be loaded.

Below are all the [CustomEvents](https://github.com/Aeroluna/Heck/wiki/Animation) added by Vivify. You'll need to have [heck](https://github.com/Aeroluna/Heck) installed.

## Blit
- **Purpose**: Apply texture to the screen.
- **Parameters**:
  - `asset`: Material resource path.
  - `duration`: Duration of the effect.

---

## AssignObjectPrefab
- **Purpose**: Replace internal game objects.
- **Parameters**:
  - `loadMode`: Load mode, can be either "Additive" or "Single".
  
  ### Color Notes
  - `asset`: Resource path for the block.
  - `debrisAsset`: Resource path for the debris.
  - `anyDirectionAsset`: Resource path for directionless blocks.
  - `track`: Applied track.
  
  ### Bomb Notes
  - `asset`: Resource path for the bomb.
  - `track`: Applied track.
  
  ### Saber
  - `type`: Indicates the saber; options include "Left", "Right", or "Both".
  - `asset`: Material resource path.
  - `trailAsset`: Material resource path for the trail.
  - `trailTopPos`: Offset position for the top end of the trail.
  - `trailBottomPos`: Offset position for the bottom end of the trail.
  - `trailDuration`: Duration of the trail.
  - `trailSamplingFrequency`: Frequency for trail sampling.
  - `trailGranularity`: Granularity of the trail.
  
  ### Burst Sliders
  - `asset`: Resource path for the slider head.
  - `track`: Applied track.
  
  ### Burst Slider Elements
  - `asset`: Resource path for the slider body.
  - `track`: Applied track.

---

## CreateCamera
- **Purpose**: Create a camera (The main camera texture is called "_Main").
- **Parameters**:
  - `id`: Identifier for the camera.
  - `texture`: Identifier for the rendering texture.
  - `depthTexture`: Identifier for the depth texture used.
  - `properties`: See `SetCameraProperty`

---

## CreateScreenTexture
- **Purpose**: Create a screen rendering texture.
- **Parameters**:
  - `id`: Identifier for the screen texture.
  - `colorFormat`: Color format for the texture.

---

## DestroyObject
- **Purpose**: Delete game objects.
- **Parameters**:
  - `id`: Array of identifiers for the objects to be deleted.

---

## InstantiatePrefab
- **Purpose**: Create game objects.
- **Parameters**:
  - `asset`: Resource path for the prefab.
  - `id`: Identifier for the instantiated object.
  - `track`: Track where the object will be instantiated.
  - `position`: Position for instantiation.
  - `rotation`: Rotation for the instantiated object.

---

## SetMaterialProperty
- **Purpose**: Set material properties.
- **Parameters**:
  - `asset`: Resource path for the material.
  - `duration`: Duration for the property change.
  - `properties`: Set properties.
    - `id`: Identifier for the material property.
    - `type`: Data type (options include Texture, Color, Float, FloatArray, Int, Vector, VectorArray, Keyword).
    - `value`: The value of the property in the form of a PointDefinition (`[data, time, "optional easing", "optional spline"]`).

---

## SetAnimatorProperty
- **Purpose**: Set animation properties.
- **Parameters**:
  - `asset`: Resource path for the animation.
  - `duration`: Duration for the property change.
  - `properties`: Set properties.
    - `id`: Identifier for the animation property.
    - `type`: Data type (options include Bool, Float, Integer, Trigger; Trigger type directly triggers without a value).
    - `value`: The value of the property in the form of a PointDefinition (`[data, time, "optional easing", "optional spline"]`).

---

## SetRenderingSettings
- **Purpose**: Set global rendering settings.
- **Parameters**:
  - `renderSettings`: Rendering parameter settings.
    - (The following settings are of type Float):
      - `ambientIntensity`
      - `fogStartDistance`
      - `flareFadeSpeed`
      - `fogEndDistance`
      - `fog`
      - `haloStrength`
      - `reflectionIntensity`
      - `ambientMode`
      - `defaultReflectionMode`
      - `defaultReflectionResolution`
      - `flareStrength`
      - `fogDensity`
      - `fogMode`
      - `reflectionBounces`
    - (The following settings are of type Vector4):
      - `ambientLight`
      - `ambientEquatorColor`
      - `ambientGroundColor`
      - `ambientSkyColor`
      - `fogColor`
      - `subtractiveShadowColor`
    - (The following settings are of type String):
      - `sun`
      - `skybox`
  - `qualitySettings`: Rendering quality settings.
    - (The following settings are of type Float):
      - `shadowCascades`
      - `shadowDistance`
      - `shadowmaskMode`
      - `shadowResolution`
      - `anisotropicFiltering`
      - `antiAliasing`
      - `pixelLightCount`
      - `realtimeReflectionProbes`
      - `shadowNearPlaneOffset`
      - `shadows`
      - `softParticles`
  - `xrSettings`: XR rendering settings.
    - `useOcclusionMesh`: Float

---

## SetGlobalProperty
- **Purpose**: Set global properties.
- **Parameters**:
  - `properties`: Set properties.
    - `id`: Identifier for the global property.
    - `type`: Data type (options include Texture, Color, Float, FloatArray, Int, Vector, VectorArray, Keyword).
    - `value`: The value of the property in the form of a PointDefinition (`[data, time, "optional easing", "optional spline"]`).

---

## SetCameraProperty
- **Purpose**: Set camera properties.
- **Parameters**:
  - `id`: Identifier for the camera.
  - `properties`: Set properties (detailed data types are not clear).
    - `depthTextureMode`
    - `clearFlags`
    - `backgroundColor`
    - `culling`
      - `track`: Culled tracks.
      - `whitelist`: Indicates if it is a whitelist.
    - `bloomPrePass`
    - `mainEffect`
