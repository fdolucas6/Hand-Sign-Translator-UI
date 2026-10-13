
export interface Landmark3D {
  x: number;
  y: number;
  z: number;
}

export interface NormalizationResult {
  features: number[];
  wristOrigin: Landmark3D;
  scaleFactor: number;
  landmarksNormalized: Landmark3D[];
}

/**
 * Connections between the 21 MediaPipe hand landmarks.
 * Used to draw the hand skeleton.
 */
export const HAND_CONNECTIONS: [number, number][] = [
  // Thumb
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],

  // Index finger
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],

  // Middle finger
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],

  // Ring finger
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],

  // Little finger
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],

  // Palm connection
  [0, 17],
];

/**
 * Normalize 21 hand landmarks to 63 features.
 *
 * Matches the existing Python pipeline:
 * 1. Subtract the wrist (landmark 0).
 * 2. Calculate the Euclidean distance of landmark 9
 *    from the wrist.
 * 3. Divide all coordinates by that distance.
 * 4. Flatten X, Y, Z into 63 values.
 */
export function normalizeLandmarks(
  rawLandmarks: Landmark3D[]
): NormalizationResult {
  if (!rawLandmarks || rawLandmarks.length !== 21) {
    throw new Error(
      `Expected 21 hand landmarks, received ${
        rawLandmarks?.length ?? 0
      }.`
    );
  }

  const wrist = rawLandmarks[0];

  const wristOrigin: Landmark3D = {
    x: wrist.x,
    y: wrist.y,
    z: wrist.z,
  };

  // Make every landmark relative to the wrist.
  const centered: Landmark3D[] = rawLandmarks.map((point) => ({
    x: point.x - wristOrigin.x,
    y: point.y - wristOrigin.y,
    z: point.z - wristOrigin.z,
  }));

  // Use landmark 9 (middle MCP) as the scale reference.
  const middleMcp = centered[9];

  let palmScale = Math.sqrt(
    middleMcp.x * middleMcp.x +
      middleMcp.y * middleMcp.y +
      middleMcp.z * middleMcp.z
  );

  if (palmScale < 1e-6) {
    palmScale = 1.0;
  }

  const features: number[] = [];
  const landmarksNormalized: Landmark3D[] = [];

  for (let i = 0; i < 21; i++) {
    const x = centered[i].x / palmScale;
    const y = centered[i].y / palmScale;
    const z = centered[i].z / palmScale;

    landmarksNormalized.push({ x, y, z });

    features.push(x, y, z);
  }

  return {
    features,
    wristOrigin,
    scaleFactor: palmScale,
    landmarksNormalized,
  };
}
