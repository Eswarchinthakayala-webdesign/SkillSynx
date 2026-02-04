
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars } from '@react-three/drei';

const ParticleField = (props) => {
    const ref = useRef();
    
    // Generate random points in a sphere
    const sphere = useMemo(() => {
        const count = 3000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 1.5 * Math.cbrt(Math.random()); // Cubic root for uniform distribution in sphere
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 20;
            ref.current.rotation.y -= delta / 25;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#818cf8" // Indigo-400 equivalent
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                    blending={2} // Additive blending
                />
            </Points>
        </group>
    );
};

const Background3D = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#0B0F1A] pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
                <ParticleField />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A] via-transparent to-transparent opacity-80" />
        </div>
    );
};

export default Background3D;
