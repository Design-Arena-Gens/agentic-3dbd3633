'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaPlay, FaStop } from 'react-icons/fa'
import Link from 'next/link'

type Exercise = 'hand-raises' | 'sit-ups'

interface PostureData {
  angle: number
  accuracy: number
  feedback: string
  completion: number
  repCount: number
}

export default function WorkoutPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [bodyDetected, setBodyDetected] = useState(false)
  const [postureData, setPostureData] = useState<PostureData>({
    angle: 0,
    accuracy: 0,
    feedback: 'Stand in view of camera',
    completion: 0,
    repCount: 0
  })
  const [sessionData, setSessionData] = useState({
    startTime: new Date(),
    duration: 0,
    caloriesBurned: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('fittrack_token')
    if (!token) {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    let stream: MediaStream
    let animationFrame: number

    const setupPoseDetection = async () => {
      try {
        await tf.ready()
        const model = poseDetection.SupportedModels.MoveNet
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
        }
        const loadedDetector = await poseDetection.createDetector(model, detectorConfig)
        setDetector(loadedDetector)

        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (error) {
        console.error('Error setting up pose detection:', error)
      }
    }

    if (isActive && selectedExercise) {
      setupPoseDetection()
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [isActive, selectedExercise])

  useEffect(() => {
    let animationFrame: number
    let prevRepState = false

    const detectPose = async () => {
      if (detector && videoRef.current && canvasRef.current && isActive) {
        const poses = await detector.estimatePoses(videoRef.current)

        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

          if (poses.length > 0) {
            const pose = poses[0]
            setBodyDetected(true)

            // Draw skeleton
            drawSkeleton(ctx, pose.keypoints)

            // Calculate posture based on exercise
            if (selectedExercise === 'hand-raises') {
              analyzeHandRaises(pose.keypoints)
            } else if (selectedExercise === 'sit-ups') {
              analyzeSitUps(pose.keypoints)
            }
          } else {
            setBodyDetected(false)
          }
        }

        animationFrame = requestAnimationFrame(detectPose)
      }
    }

    if (detector && isActive) {
      detectPose()
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [detector, isActive, selectedExercise])

  const drawSkeleton = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    const connections = [
      [5, 7], [7, 9],   // Left arm
      [6, 8], [8, 10],  // Right arm
      [5, 6],           // Shoulders
      [5, 11], [6, 12], // Torso
      [11, 12],         // Hips
      [11, 13], [13, 15], // Left leg
      [12, 14], [14, 16]  // Right leg
    ]

    // Draw bones
    connections.forEach(([i, j]) => {
      const kp1 = keypoints[i]
      const kp2 = keypoints[j]
      if (kp1.score > 0.3 && kp2.score > 0.3) {
        ctx.beginPath()
        ctx.moveTo(kp1.x, kp1.y)
        ctx.lineTo(kp2.x, kp2.y)
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 3
        ctx.stroke()
      }
    })

    // Draw joints
    keypoints.forEach(kp => {
      if (kp.score > 0.3) {
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI)
        ctx.fillStyle = '#22c55e'
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  }

  const calculateAngle = (a: any, b: any, c: any): number => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
    let angle = Math.abs(radians * 180.0 / Math.PI)
    if (angle > 180.0) {
      angle = 360 - angle
    }
    return angle
  }

  const analyzeHandRaises = (keypoints: any[]) => {
    const leftShoulder = keypoints[5]
    const rightShoulder = keypoints[6]
    const leftElbow = keypoints[7]
    const rightElbow = keypoints[8]
    const leftWrist = keypoints[9]
    const rightWrist = keypoints[10]

    if (leftShoulder.score > 0.3 && leftElbow.score > 0.3 && leftWrist.score > 0.3) {
      const leftAngle = calculateAngle(leftWrist, leftElbow, leftShoulder)
      const armRaiseAngle = Math.abs(leftWrist.y - leftShoulder.y)

      let feedback = ''
      let accuracy = 0
      let completion = 0

      if (armRaiseAngle > 100) {
        feedback = 'Excellent! Arms at shoulder height'
        accuracy = 95
        completion = 100
        setPostureData(prev => ({ ...prev, repCount: prev.repCount + 1 }))
      } else if (armRaiseAngle > 60) {
        feedback = 'Good! Raise arms a bit higher'
        accuracy = 75
        completion = 70
      } else {
        feedback = 'Raise your arms to shoulder level'
        accuracy = 50
        completion = 30
      }

      if (leftAngle < 160) {
        feedback = 'Keep your arms straight'
        accuracy = Math.max(accuracy - 20, 0)
      }

      setPostureData(prev => ({
        ...prev,
        angle: Math.round(leftAngle),
        accuracy,
        feedback,
        completion
      }))
    }
  }

  const analyzeSitUps = (keypoints: any[]) => {
    const leftShoulder = keypoints[5]
    const leftHip = keypoints[11]
    const leftKnee = keypoints[13]

    if (leftShoulder.score > 0.3 && leftHip.score > 0.3 && leftKnee.score > 0.3) {
      const torsoAngle = calculateAngle(leftShoulder, leftHip, leftKnee)

      let feedback = ''
      let accuracy = 0
      let completion = 0

      if (torsoAngle < 90) {
        feedback = 'Perfect sit-up! Full contraction'
        accuracy = 95
        completion = 100
        setPostureData(prev => ({ ...prev, repCount: prev.repCount + 1 }))
      } else if (torsoAngle < 120) {
        feedback = 'Good! Curl up a bit more'
        accuracy = 75
        completion = 60
      } else {
        feedback = 'Lower yourself down, then curl up using core'
        accuracy = 50
        completion = 20
      }

      setPostureData(prev => ({
        ...prev,
        angle: Math.round(torsoAngle),
        accuracy,
        feedback,
        completion
      }))
    }
  }

  const handleStart = () => {
    if (!selectedExercise) {
      alert('Please select an exercise first')
      return
    }
    setIsActive(true)
    setSessionData({ ...sessionData, startTime: new Date() })
  }

  const handleStop = async () => {
    setIsActive(false)

    const duration = Math.floor((new Date().getTime() - sessionData.startTime.getTime()) / 1000)
    const calories = Math.floor(duration * 0.1 * (selectedExercise === 'sit-ups' ? 1.5 : 1.2))

    const workoutData = {
      exercise: selectedExercise,
      duration,
      reps: postureData.repCount,
      avgAccuracy: postureData.accuracy,
      caloriesBurned: calories,
      timestamp: new Date().toISOString()
    }

    try {
      const token = localStorage.getItem('fittrack_token')
      await fetch('/api/workout/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
      })
    } catch (error) {
      console.error('Failed to save workout:', error)
    }

    alert(`Workout Complete!\nDuration: ${duration}s\nReps: ${postureData.repCount}\nCalories: ${calories}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
              <FaArrowLeft /> Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">AI Posture Detection</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedExercise ? (
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedExercise('hand-raises')}
              className="cursor-pointer bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            >
              <div className="text-6xl mb-4">💪</div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Hand Raises</h2>
              <p className="text-gray-600 dark:text-gray-400">Upper body strength exercise with real-time form analysis</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedExercise('sit-ups')}
              className="cursor-pointer bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            >
              <div className="text-6xl mb-4">🏋️</div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Sit-ups</h2>
              <p className="text-gray-600 dark:text-gray-400">Core strengthening with AI posture correction</p>
            </motion.div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="relative">
                  <video
                    ref={videoRef}
                    width="640"
                    height="480"
                    className="rounded-lg w-full"
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    className="absolute top-0 left-0 w-full h-full"
                  />

                  {!bodyDetected && isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <p className="text-white text-xl font-semibold">Position your body in frame</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-4">
                  {!isActive ? (
                    <button
                      onClick={handleStart}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                    >
                      <FaPlay /> Start Workout
                    </button>
                  ) : (
                    <button
                      onClick={handleStop}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                    >
                      <FaStop /> Stop Workout
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Live Analysis</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completion</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
                          style={{ width: `${postureData.completion}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold dark:text-white">{postureData.completion}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accuracy</p>
                    <div className="text-3xl font-bold dark:text-white">{postureData.accuracy}%</div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Joint Angle</p>
                    <div className="text-3xl font-bold dark:text-white">{postureData.angle}°</div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rep Count</p>
                    <div className="text-3xl font-bold dark:text-white">{postureData.repCount}</div>
                  </div>

                  <div className={`p-4 rounded-lg ${postureData.accuracy > 80 ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                    <p className={`font-semibold ${postureData.accuracy > 80 ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                      {postureData.feedback}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Exercise: {selectedExercise}</h3>
                <button
                  onClick={() => {
                    setSelectedExercise(null)
                    setIsActive(false)
                  }}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Change Exercise
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
