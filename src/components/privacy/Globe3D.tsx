import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Jurisdiction, JURISDICTIONS, REGION_COLORS, YEAR_MAX, YEAR_MIN } from "@/data/jurisdictions";
import { Play } from "lucide-react";
import COUNTRY_CENTROIDS from "@/lib/countryCentroids";

interface GlobeCountry {
  iso3: string;
  lat: number;
  lon: number;
  region: string;
  year: number | null;
  comprehensive: boolean;
  jurisdiction: Jurisdiction;
}

const RADIUS = 1;
const UP = new THREE.Vector3(0, 1, 0);
const FALLBACK_REGION = "hsl(200, 88%, 60%)";
const INACTIVE_NODE = new THREE.Color("hsl(214, 18%, 42%)");
const INACTIVE_PAD = new THREE.Color("hsl(218, 28%, 26%)");
const WHITE = new THREE.Color("hsl(0, 0%, 100%)");

function normalizeHsl(color: string) {
  return color.replace(
    /hsla?\(\s*([\d.]+)\s+([\d.]+%)\s+([\d.]+%)(?:\s*\/\s*([\d.]+%?))?\s*\)/i,
    (_, h, s, l, a) => (a ? `hsla(${h}, ${s}, ${l}, ${a})` : `hsl(${h}, ${s}, ${l})`),
  );
}

function toThreeColor(color: string) {
  return new THREE.Color(normalizeHsl(color));
}

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
    <>
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshPhongMaterial
          color="hsl(207, 84%, 34%)"
          emissive="hsl(218, 54%, 16%)"
          emissiveIntensity={0.75}
          specular="hsl(190, 100%, 92%)"
          shininess={32}
        />
      </mesh>
      <mesh scale={0.985}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial color="hsl(214, 92%, 20%)" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

function Atmosphere() {
  return (
    <>
      <mesh scale={1.06}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="hsl(196, 100%, 72%)"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.14}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshBasicMaterial
          color="hsl(214, 100%, 78%)"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function Graticule() {
  const lines = useMemo(() => {
    const segs: THREE.Vector3[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 5) {
        segs.push(latLonToVec3(lat, lon, RADIUS * 1.003));
        segs.push(latLonToVec3(lat, lon + 5, RADIUS * 1.003));
      }
    }
    for (let lon = -180; lon <= 180; lon += 30) {
      for (let lat = -85; lat < 85; lat += 5) {
        segs.push(latLonToVec3(lat, lon, RADIUS * 1.003));
        segs.push(latLonToVec3(lat + 5, lon, RADIUS * 1.003));
      }
    }
    return new THREE.BufferGeometry().setFromPoints(segs);
  }, []);

  return (
    <lineSegments geometry={lines}>
      <lineBasicMaterial color="hsl(193, 76%, 74%)" transparent opacity={0.4} />
    </lineSegments>
  );
}

function CountryNodes({
  countries,
  year,
  onSelect,
}: {
  countries: GlobeCountry[];
  year: number;
  onSelect: (j: Jurisdiction) => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const colorMap = useMemo(
    () => countries.map((c) => toThreeColor(REGION_COLORS[c.region] ?? FALLBACK_REGION)),
    [countries],
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    countries.forEach((country, index) => {
      const active = country.comprehensive && !!country.year && country.year <= year;
      const scale = active ? 0.017 : 0.0115;

      dummy.position.copy(latLonToVec3(country.lat, country.lon, RADIUS + 0.022));
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);

      tempColor.copy(colorMap[index]).lerp(active ? WHITE : INACTIVE_NODE, active ? 0.18 : 0.6);
      mesh.setColorAt(index, tempColor);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as any, undefined as any, countries.length]}
      onClick={(e) => {
        e.stopPropagation();
        const id = (e as any).instanceId as number | undefined;
        if (id != null && countries[id]) onSelect(countries[id].jurisdiction);
      }}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial vertexColors transparent opacity={0.98} depthWrite={false} />
    </instancedMesh>
  );
}

function CountryPads({
  dots,
  year,
  onSelect,
}: {
  dots: GlobeCountry[];
  year: number;
  onSelect: (j: Jurisdiction) => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const colorMap = useMemo(
    () => dots.map((d) => toThreeColor(REGION_COLORS[d.region] ?? FALLBACK_REGION)),
    [dots],
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    dots.forEach((dot, index) => {
      const active = !!dot.year && dot.year <= year;
      const progress = active && dot.year ? Math.min(1, (year - dot.year + 1) / 18) : 0;
      const radius = active ? 0.018 + progress * 0.008 : 0.010;
      const height = active ? 0.05 + progress * 0.12 : 0.012;
      const normal = latLonToVec3(dot.lat, dot.lon, 1).normalize();

      dummy.position.copy(normal).multiplyScalar(RADIUS + 0.014 + height / 2);
      dummy.quaternion.setFromUnitVectors(UP, normal);
      dummy.scale.set(radius, height, radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);

      tempColor.copy(colorMap[index]).lerp(active ? WHITE : INACTIVE_PAD, active ? 0.22 : 0.72);
      mesh.setColorAt(index, tempColor);
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
      <cylinderGeometry args={[1, 1, 1, 10, 1, false]} />
      <meshStandardMaterial
        vertexColors
        emissive="hsl(0, 0%, 100%)"
        emissiveIntensity={0.24}
        metalness={0.08}
        roughness={0.28}
      />
    </instancedMesh>
  );
}

function Scene({
  countries,
  dots,
  year,
  onSelect,
  reduced,
}: {
  countries: GlobeCountry[];
  dots: GlobeCountry[];
  year: number;
  onSelect: (j: Jurisdiction) => void;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!reduced && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      <hemisphereLight
        color="hsl(196, 100%, 86%)"
        groundColor="hsl(226, 38%, 11%)"
        intensity={1.4}
      />
      <directionalLight position={[3.6, 1.6, 3.2]} intensity={2.2} color="hsl(43, 100%, 86%)" />
      <directionalLight position={[-3.2, -0.8, -2.8]} intensity={1.25} color="hsl(198, 100%, 72%)" />
      <pointLight position={[0, 0.3, 2.4]} intensity={1.1} color="hsl(0, 0%, 100%)" />
      <Stars radius={24} depth={36} count={3200} factor={3.4} saturation={0} fade speed={0.6} />

      <group ref={groupRef}>
        <Earth />
        <Graticule />
        <Atmosphere />
        <CountryNodes countries={countries} year={year} onSelect={onSelect} />
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
  const countries = useMemo<GlobeCountry[]>(() => {
    const out: GlobeCountry[] = [];

    JURISDICTIONS.forEach((jurisdiction) => {
      if (!jurisdiction.iso3) return;
      const centroid = COUNTRY_CENTROIDS[jurisdiction.iso3];
      if (!centroid) return;

      out.push({
        iso3: jurisdiction.iso3,
        lat: centroid[0],
        lon: centroid[1],
        region: jurisdiction.region,
        year: jurisdiction.year,
        comprehensive: jurisdiction.lawStatus === "comprehensive",
        jurisdiction,
      });
    });

    return out;
  }, []);

  const dots = useMemo(
    () => countries.filter((country) => country.comprehensive && !!country.year),
    [countries],
  );

  const [year, setYear] = useState(YEAR_MAX);
  const [animating, setAnimating] = useState(true);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
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
      const progress = Math.min(1, (t - start) / duration);
      setYear(Math.round(YEAR_MIN + (YEAR_MAX - YEAR_MIN) * progress));
      if (progress < 1) raf = requestAnimationFrame(loop);
      else setAnimating(false);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animating, reduced]);

  const cumulative = dots.filter((dot) => !!dot.year && dot.year <= year).length;
  const visibleTotal = dots.length || total;

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-2xl border border-border/50 shadow-soft"
        style={{
          aspectRatio: "900 / 420",
          background:
            "radial-gradient(circle at 50% 35%, hsl(210, 56%, 18%) 0%, hsl(227, 36%, 11%) 58%, hsl(230, 38%, 7%) 100%)",
        }}
      >
        <div className="absolute inset-0 h-full w-full">
          <Canvas
            camera={{ position: [0, 0, 2.75], fov: 42 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Scene countries={countries} dots={dots} year={year} onSelect={onSelect} reduced={reduced} />
              <OrbitControls
                enablePan={false}
                enableZoom
                minDistance={1.75}
                maxDistance={4.2}
                rotateSpeed={0.65}
                zoomSpeed={0.6}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <div className="absolute top-3 left-3 flex items-baseline gap-2 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 backdrop-blur pointer-events-none">
        <span className="font-display text-2xl font-black tabular-nums leading-none text-accent">
          {year}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {cumulative} / {visibleTotal}
        </span>
      </div>

      {!animating && (
        <button
          onClick={() => setAnimating(true)}
          className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 text-[10px] uppercase tracking-widest backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Play className="h-3 w-3" /> Replay
        </button>
      )}

      <div className="absolute bottom-3 left-3 rounded-full border border-border/40 bg-background/70 px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur pointer-events-none">
        Regiones por color · puntos por país · columnas por año
      </div>
    </div>
  );
};

export default Globe3D;
