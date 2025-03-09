'use client'
import React, { useEffect, useState, useRef } from 'react'
import ReactD3Speedometer from "react-d3-speedometer"
import { IconWeight, IconRuler, IconChartDonut, IconAlertCircle } from '@tabler/icons-react'
import { NumberTicker } from '../../../components/magicui/number-ticker'

const BmiGauge = ({ weight, height }) => {
    const [dimensions, setDimensions] = useState({ width: 300, height: 180 })
    const containerRef = useRef(null)

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const newWidth = Math.min(containerWidth, 500)
                setDimensions({
                    width: newWidth,
                    height: newWidth * 0.6
                })
            }
        }

        const observer = new ResizeObserver(updateDimensions)
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        updateDimensions()

        return () => {
            observer.disconnect()
        }
    }, [])

    const calculateBMI = () => {
        if (!weight || !height) return 0
        const heightInMeters = height / 100
        return weight / (heightInMeters * heightInMeters)
    }

    const getBmiStatus = (bmi) => {
        if (bmi < 18.5) return { label: 'Underweight', color: '#3B82F6' }
        if (bmi < 25) return { label: 'Normal', color: '#10B981' }
        if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' }
        return { label: 'Obese', color: '#EF4444' }
    }

    const bmi = calculateBMI()
    const status = getBmiStatus(bmi)

    return (
        <div ref={containerRef} className="w-full h-full p-2 group">
            <div className="w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-4 md:p-6 border border-emerald-100/50 backdrop-blur-sm transition-all duration-300">
                <div className="mb-4 text-center">
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                        Health Metrics
                    </h2>
                    <p className="text-xs md:text-sm text-emerald-600 mt-1">Personalized BMI Analysis</p>
                </div>
                <div className="relative w-full flex flex-col items-center justify-center mb-3 md:mb-4">
                    <div className="absolute inset-0 bg-white/30 rounded-2xl blur-md" />
                    <ReactD3Speedometer
                        width={dimensions.width}
                        height={dimensions.height}
                        needleHeightRatio={0.7}
                        value={bmi}
                        customSegmentStops={[0, 18.5, 25, 30, 40]}
                        segmentColors={['#93c5fd', '#86efac', '#fde047', '#fca5a5']}
                        needleColor="#9333ea"
                        needleTransitionDuration={1000}
                        textColor="#1F2937"
                        valueTextFontSize={`${Math.min(dimensions.width * 0.05, 16)}px`}
                        labelFontSize={`${Math.min(dimensions.width * 0.04, 14)}px`}
                        maxValue={40}
                        ringWidth={dimensions.width * 0.08}
                    />
                    <div className="mt-0 sm:mt-4 text-center flex flex-col">
                        <span className="text-3xl md:text-4xl font-black drop-shadow-sm" style={{ color: status.color }}>
                            <NumberTicker value={parseFloat(bmi.toFixed(1))} className="whitespace-pre-wrap tracking-tighter" />
                        </span>
                        <span className="text-xs md:text-sm font-semibold text-gray-600">BMI Index</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 max-sm:grid-cols-2 gap-2 w-full">
                    <StatusIndicator color={status.color} label={status.label} icon={<IconChartDonut className="w-4 h-4" />} current={bmi.toFixed(1)} />
                    <StatusIndicator color="#3b82f6" label="Weight" value={`${weight} kg`} icon={<IconWeight className="w-4 h-4" />} />
                    <StatusIndicator color="#16a34a" label="Height" value={`${height} cm`} icon={<IconRuler className="w-4 h-4" />} />
                    <StatusIndicator color="#eab308" label="Status" value={status.label} icon={<IconAlertCircle className="w-4 h-4" />} />
                </div>
                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 pointer-events-none" />
            </div>
        </div>
    )
}

const StatusIndicator = ({ color, label, value, icon, current }) => (
    <div className="flex-shrink-0 w-32 md:w-auto md:flex-1 p-3 bg-white rounded-xl border border-emerald-100 transition-transform duration-200 hover:scale-[1.02]">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: color + '20' }}>
                {icon && React.cloneElement(icon, { className: "w-4 h-4", style: { color } })}
            </div>
            <span className="text-xs font-semibold text-gray-700">{label}</span>
        </div>
        {current ? (
            <p className="text-lg font-bold truncate" style={{ color }}>{current}</p>
        ) : (
            <p className="text-sm font-medium text-gray-600 truncate">{value}</p>
        )}
    </div>
)

export default BmiGauge