"use client";

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Float, Center } from "@react-three/drei";
import * as THREE from "three";

function WateringCan({ isHeld, onWateringComplete }: { isHeld: boolean, onWateringComplete: () => void }) {
  const { scene } = useGLTF("/assets/watering_can.glb");
  const group = useRef<THREE.Group>(null);
  const holdStartTime = useRef<number | null>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    // Target rotation: tilt forward on Z axis if held
    // Depending on the model's orientation, we might need to tilt on X or Z. Let's assume Z tilts it down.
    const targetX = isHeld ? Math.PI / 3 : 0; 
    
    // Smoothly damp the rotation towards the target
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    
    if (isHeld) {
        if (holdStartTime.current === null) {
            holdStartTime.current = state.clock.elapsedTime;
        } else {
            const heldDuration = state.clock.elapsedTime - holdStartTime.current;
            if (heldDuration >= 2) { // 2 seconds
                onWateringComplete();
            }
        }
    } else {
        holdStartTime.current = null;
    }
  });

  return (
    <group ref={group} dispose={null} position={[-0.8, 0.5, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Center>
                <primitive object={scene} scale={2} />
            </Center>
        </Float>
    </group>
  );
}

// Preload the model so it's ready immediately
if (typeof window !== "undefined") {
    useGLTF.preload("/assets/watering_can.glb");
}

export default function WateringCanScene({ 
    onWatered, 
    onHoldStart, 
    onHoldEnd 
}: { 
    onWatered: () => void,
    onHoldStart?: () => void,
    onHoldEnd?: () => void
}) {
  const [isHeld, setIsHeld] = useState(false);

  return (
    <div 
        className="w-full h-64 relative z-50 touch-none select-none flex flex-col items-center justify-center"
        onPointerDown={(e) => { 
            e.preventDefault(); 
            setIsHeld(true); 
            onHoldStart?.();
        }}
        onPointerUp={() => {
            setIsHeld(false);
            onHoldEnd?.();
        }}
        onPointerLeave={() => {
            setIsHeld(false);
            onHoldEnd?.();
        }}
        style={{ cursor: isHeld ? "grabbing" : "grab" }}
    >
      {/* Stylized text and bending arrow instructing the user */}
      <div className="absolute -top-12 right-[10%] md:right-[20%] pointer-events-none flex flex-col items-end">
        <div className="text-base font-serif italic tracking-wide text-[#785d24] rotate-[4deg] mr-1">
          {isHeld ? "Watering..." : "Hold to water the plant"}
        </div>
        {!isHeld && (
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#785d24] opacity-100 mr-38">
              <path d="M 80 10 Q 40 10 40 80" />
              <path d="M 25 65 L 40 80 L 55 65" />
          </svg>
        )}
      </div>

      <Canvas camera={{ position: [-2, 2, 3], fov: 45 }}>
        <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Environment preset="city" />
            
            <WateringCan isHeld={isHeld} onWateringComplete={onWatered} />
            
            <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={10} blur={2} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
