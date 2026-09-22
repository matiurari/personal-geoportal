"use client";

export async function loadGlbTerkoreksi({
    viewer,
    url,
    latitude,
    longitude,
    heightMeter = 0,
    headingDeg = 0,
    pitchDeg = 0,
    rollDeg = 0,
    scale = 1,
    zoomTo = false,
}) {
    const Cesium = window.Cesium;
    if (!Cesium || !viewer) {
        throw new Error("Cesium atau viewer belum siap.");
    }

    const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, heightMeter);
    const hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(headingDeg),
        Cesium.Math.toRadians(pitchDeg),
        Cesium.Math.toRadians(rollDeg)
    );
    const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr);

    const model = await Cesium.Model.fromGltfAsync({
        url,
        modelMatrix,
        scale,
    });

    viewer.scene.primitives.add(model);

    return new Promise((resolve) => {
        model.readyEvent.addEventListener(() => {
            const actualCenter = model.boundingSphere.center;

            const delta = Cesium.Cartesian3.subtract(
                position,
                actualCenter,
                new Cesium.Cartesian3()
            );

            const translasiLama = Cesium.Matrix4.getTranslation(
                model.modelMatrix,
                new Cesium.Cartesian3()
            );
            const translasiBaru = Cesium.Cartesian3.add(
                translasiLama,
                delta,
                new Cesium.Cartesian3()
            );
            Cesium.Matrix4.setTranslation(model.modelMatrix, translasiBaru, model.modelMatrix);

            if (zoomTo) {
                viewer.zoomTo(model).catch((err) => {
                    console.error("Gagal Zoom:", err?.message || err);
                });
            }

            resolve(model);
        });
    });
}