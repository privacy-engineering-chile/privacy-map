import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Jurisdiction, JURISDICTIONS, REGION_COLORS, YEAR_MAX, YEAR_MIN } from "@/data/jurisdictions";
import { Play } from "lucide-react";

interface CountryDot {
  iso3: string;
  lat: number;
  lon: number;
  year: number;
  region: string;
  jurisdiction: Jurisdiction;
}

// Approximate centroids — uses jurisdictions iso3 and a small embedded centroid table for coverage.
// We rely on a runtime fetch of a tiny centroid JSON if available; fallback: skip countries without coords.
import COUNTRY_CENTROIDS from "@/lib/countryCentroids";

const RADIUS = 1;

function latLonToVec3(lat: number, lon: number, r = RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[RADIUS * 0.995, 64, 64]} />
      <meshStandardMaterial
        color="#0b1a2b"
        roughness={1}
        metalness={0}
        emissive="#0a1828"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[RADIUS, 32, 32]} />
      <meshBasicMaterial
        color="#3aa6ff"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Graticule() {
  const lines = useMemo(() => {
    const segs: THREE.Vector3[] = [];
    // parallels every 30°
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 5) {
        segs.push(latLonToVec3(lat, lon, RADIUS * 1.001));
        segs.push(latLonToVec3(lat, lon + 5, RADIUS * 1.001));
      }
    }
    // meridians every 30°
    for (let lon = -180; lon <= 180; lon += 30) {
      for (let lat = -85; lat < 85; lat += 5) {
        segs.push(latLonToVec3(lat, lon, RADIUS * 1.001));
        segs.push(latLonToVec3(lat + 5, lon, RADIUS * 1.001));
      }
    }
    const g = new THREE.BufferGeometry().setFromPoints(segs);
    return g;
  }, []);
  return (
    <lineSegments geometry={lines}>
      <lineBasicMaterial color="#1d3a55" transparent opacity={0.35} />
    </lineSegments>
  );
}

function CountryPads({
  dots,
  year,
  onSelect,
}: {
  dots: CountryDot[];
  year: number;
  onSelect: (j: Jurisdiction) => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorMap = useMemo(() => {
    return dots.map((d) => new THREE.Color(REGION_COLORS[d.region] ?? "#3aa6ff"));
  }, [dots]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    dots.forEach((d, i) => {
      const lit = d.year <= year;
      const t = lit ? 1 : 0.001;
      const pos = latLonToVec3(d.lat, d.lon, RADIUS + 0.005 + t * 0.06);
      dummy.position.copy(pos);
      dummy.lookAt(0, 0, 0);
      dummy.scale.set(0.018, 0.018, lit ? 0.04 + Math.min(1, (year - d.year) / 30) * 0.06 : 0.001);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      const c = colorMap[i];
      mesh.setColorAt(i, lit ? c : new THREE.Color("#243648"));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as any, undefined as any, dots.length]}
      onClick={(e) => {
        e.stopPropagation();
        const id = (e as any).instanceId as number | undefined;
        if (id != null && dots[id]) onSelect(dots[id].jurisdiction);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial vertexColors emissiveIntensity={0.6} />
    </instancedMesh>
  );
}

function AutoRotate({ enabled }: { enabled: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (enabled && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });
  return <group ref={groupRef} />;
}

function Scene({
  dots,
  year,
  onSelect,
  reduced,
}: {
  dots: CountryDot[];
  year: number;
  onSelect: (j: Jurisdiction) => void;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!reduced && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} />
      <Stars radius={20} depth={30} count={2500} factor={3} fade speed={0.5} />
      <group ref={groupRef}>
        <Earth />
        <Graticule />
        <Atmosphere />
        <CountryPads dots={dots} year={year} onSelect={onSelect} />
      </group>
    </>
  );
}

interface Props {
  onSelect: (j: Jurisdiction) => void;
  total: number;
}

export const Globe3D = ({ onSelect, total }: Props) => {
  const dots = useMemo<CountryDot[]>(() => {
    const out: CountryDot[] = [];
    JURISDICTIONS.forEach((j) => {
      if (!j.iso3 || !j.year || j.lawStatus !== "comprehensive") return;
      const c = COUNTRY_CENTROIDS[j.iso3];
      if (!c) return;
      out.push({
        iso3: j.iso3,
        lat: c[0],
        lon: c[1],
        year: j.year,
        region: j.region,
        jurisdiction: j,
      });
    });
    return out;
  }, []);

  const [year, setYear] = useState(YEAR_MAX);
  const [animating, setAnimating] = useState(true);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (reduced) {
      setYear(YEAR_MAX);
      setAnimating(false);
      return;
    }
    if (!animating) return;
    setYear(YEAR_MIN);
    let start = 0;
    let raf = 0;
    const duration = 6000;
    const loop = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setYear(Math.round(YEAR_MIN + (YEAR_MAX - YEAR_MIN) * p));
      if (p < 1) raf = requestAnimationFrame(loop);
      else setAnimating(false);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animating, reduced]);

  const cumulative = dots.filter((d) => d.year <= year).length;

  return (
    <div className="relative">
      <div
        className="rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm border border-border/50 shadow-soft"
        style={{ aspectRatio: "900 / 420" }}
      >
        <Canvas
          camera={{ position: [0, 0, 2.6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene dots={dots} year={year} onSelect={onSelect} reduced={reduced} />
            <OrbitControls
              enablePan={false}
              enableZoom
              minDistance={1.6}
              maxDistance={4}
              rotateSpeed={0.6}
              zoomSpeed={0.6}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute top-3 left-3 flex items-baseline gap-2 bg-background/85 backdrop-blur px-3 py-1.5 rounded-full border border-border/60 pointer-events-none">
        <span className="font-display text-2xl font-black tabular-nums text-accent leading-none">
          {year}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {cumulative} / {total}
        </span>
      </div>

      {!animating && (
        <button
          onClick={() => setAnimating(true)}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest bg-background/85 backdrop-blur px-3 py-1.5 rounded-full border border-border/60 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Play className="h-3 w-3" /> Replay
        </button>
      )}

      <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-muted-foreground bg-background/70 backdrop-blur px-2 py-1 rounded-full border border-border/40 pointer-events-none">
        Arrastra para rotar · scroll para zoom
      </div>
    </div>
  );
};

export default Globe3D;
