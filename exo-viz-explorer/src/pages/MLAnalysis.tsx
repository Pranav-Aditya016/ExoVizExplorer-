import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Brain, Database, Zap, Key, Upload, Globe, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DataUploadInterface from '@/components/DataUploadInterface';
import AIModelDashboard from '@/components/AIModelDashboard';
import { ModelPrediction } from '@/services/mlModelService';
import { planets } from '@/data/planetData';

const MLAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [currentPrediction, setCurrentPrediction] = useState<ModelPrediction | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState<ModelPrediction[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [targetId, setTargetId] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleAnalysisComplete = (prediction: ModelPrediction) => {
    setCurrentPrediction(prediction);
    setAnalysisHistory(prev => [prediction, ...prev.slice(0, 4)]); // Keep last 5 analyses
  };

  const handleFetchData = async () => {
    if (!apiKey || !targetId) {
      alert('Please enter both API key and target ID');
      return;
    }
    
    setIsLoadingData(true);
    try {
      // Simulate API call - in real implementation, you'd call NASA's API
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Data fetched successfully! (This is a simulation)');
    } catch (error) {
      alert('Failed to fetch data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const currentPlanet = planets[selectedPlanet];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Model Analysis</h1>
                <p className="text-sm text-white/70">Upload Kepler/TESS data for ML-powered exoplanet detection</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                <Brain className="h-3 w-3 mr-1" />
                ML Enabled
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Input Section */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Data Input & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger value="api" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      API Key
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <DataUploadInterface onAnalysisComplete={handleAnalysisComplete} />
                  </TabsContent>
                  
                  <TabsContent value="api" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key">NASA API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          placeholder="Enter your NASA API key"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Get your API key from <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">api.nasa.gov</a>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="target-id">Target ID</Label>
                        <Input
                          id="target-id"
                          placeholder="Enter target ID (e.g., KIC 1234567)"
                          value={targetId}
                          onChange={(e) => setTargetId(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleFetchData} 
                        disabled={isLoadingData || !apiKey || !targetId}
                        className="w-full"
                      >
                        {isLoadingData ? 'Fetching Data...' : 'Fetch Data'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Model Information */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-primary" />
                  Model Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Model Type:</span>
                    <p className="font-medium">Deep Learning CNN</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Training Data:</span>
                    <p className="font-medium">Kepler + TESS</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span>
                    <p className="font-medium">94.2%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Parameters:</span>
                    <p className="font-medium">2.3M</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    This model analyzes light curve data to detect planetary transits, 
                    classify planet types, and predict habitability indicators.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Dashboard Section */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Model Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIModelDashboard 
                  planetData={currentPlanet} 
                  isAnalyzing={false}
                  modelPrediction={currentPrediction}
                />
              </CardContent>
            </Card>

            {/* Prediction Results */}
            {currentPrediction && (
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    Prediction Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Planet Type:</span>
                        <Badge variant="outline">{currentPrediction.planetType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Probability:</span>
                        <span className="font-bold text-primary">
                          {(currentPrediction.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-bold text-primary">
                          {(currentPrediction.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Temperature:</span>
                        <span>{currentPrediction.temperature}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Radius:</span>
                        <span>{currentPrediction.radius.toFixed(2)}R⊕</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distance:</span>
                        <span>{currentPrediction.distanceFromStar.toFixed(3)}AU</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentPrediction.hasAtmosphere ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span>Atmosphere</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentPrediction.hasWater ? 'bg-blue-500' : 'bg-gray-400'}`} />
                      <span>Water</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${currentPrediction.isHabitable ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span>Habitable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm">Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysisHistory.map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-card/50">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${prediction.isHabitable ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-sm font-medium">{prediction.planetType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">{(prediction.probability * 100).toFixed(1)}%</span>
                        <Badge variant="outline" className="text-xs">
                          {prediction.isHabitable ? "Habitable" : "Non-habitable"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Navigation to Other Pages */}
            {currentPrediction && (
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm">Explore Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/')}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      View Planet Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/exoplanet-explorer')}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Explore Exoplanet System
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/photorealistic')}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Photorealistic View
                    </Button>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Navigate to different views to explore your analyzed planet data in 3D environments.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>1. Upload your Kepler, K2, or TESS light curve data (CSV, FITS, or text format)</p>
                <p>2. The AI model will analyze the data for planetary transits</p>
                <p>3. View detailed predictions including planet type, habitability, and physical properties</p>
                <p>4. Navigate to other pages to explore your results in 3D</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLAnalysis;
