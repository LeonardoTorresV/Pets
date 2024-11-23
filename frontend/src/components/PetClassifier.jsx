import React, { useState, useRef, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

const PetClassifier = () => {
    const videoRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let predictionInterval;

        const startPredictionLoop = async () => {
            if (!isStreaming || !videoRef.current) return;

            try {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoRef.current, 0, 0);

                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('frame', blob);

                    const response = await fetch('https://fictional-computing-machine-qjxq4q76wj4h6654-5000.app.github.dev/predict_frame', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) throw new Error('Error en la predicción');

                    const data = await response.json();
                    setPrediction(data.prediction);
                }, 'image/jpeg');
            } catch (err) {
                setError('Error en la detección');
                stopStream();
            }
        };

        if (isStreaming) {
            predictionInterval = setInterval(startPredictionLoop, 1000);
        }

        return () => {
            if (predictionInterval) {
                clearInterval(predictionInterval);
            }
        };
    }, [isStreaming]);

    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    frameRate: { ideal: 30 }
                }
            });
            videoRef.current.srcObject = stream;
            setIsStreaming(true);
            setError(null);
        } catch (err) {
            setError('No se pudo acceder a la cámara');
        }
    };

    const stopStream = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsStreaming(false);
            setPrediction(null);
        }
    };

    const containerStyle = {
        maxWidth: '600px',
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        margin: '0 610px'
    };

    const cardStyle = {
        backgroundColor: '#a4c467',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px'
    };

    const titleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px'
    };

    const videoStyle = {
        width: '100%',
        borderRadius: '8px',
        backgroundColor: 'black',
        marginBottom: '20px'
    };

    const buttonStyle = {
        backgroundColor: isStreaming ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '0 auto'
    };

    const predictionStyle = {
        padding: '12px',
        backgroundColor: '#6786c4',
        borderRadius: '6px',
        marginTop: '16px',
        textAlign: 'center'
    };

    const errorStyle = {
        padding: '12px',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        borderRadius: '6px',
        marginTop: '16px',
        textAlign: 'center'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={titleStyle}>
                    Detector de Mascotas en Tiempo Real
                </h1>
                <div>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={videoStyle}
                    />

                    <button
                        onClick={isStreaming ? stopStream : startStream}
                        style={buttonStyle}
                    >
                        {isStreaming ? '🛑 Detener Cámara' : '📷 Iniciar Cámara'}
                    </button>

                    {prediction && (
                        <div style={predictionStyle}>
                            <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Predicción</h2>
                            <p style={{ fontSize: '18px' }}>
                                {prediction === 'dog' ? '🐕 Perro' : '🐱 Gato'}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div style={errorStyle}>
                            <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Error</h2>
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    {
        !prediction && !error && (
            <div style={{ textAlign: 'center' }}>
                <ClipLoader color="#3b82f6" loading={true} size={50} />
                <p>Procesando...</p>
            </div>
        )
    };
};

export default PetClassifier;