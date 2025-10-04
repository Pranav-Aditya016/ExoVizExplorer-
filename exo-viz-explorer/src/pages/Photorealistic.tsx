import { useState } from "react";
import PhotorealisticPlanets from "@/components/PhotorealisticPlanets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Info, RotateCcw, Play, Pause, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Photorealistic = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  const planetFeatures = [
    {
      name: "Kepler-452b",
      description: "Earth's Cousin - Terrestrial world with deep blue oceans and green continents",
      features: ["Oceans", "Continents", "Clouds", "Atmosphere"],
      color: "bg-blue-500",
      type: "Terrestrial"
    },
    {
      name: "Proxima Centauri b", 
      description: "Rocky, tidally-locked planet with dark red cratered surface",
      features: ["Rocky Surface", "Craters", "Tidally Locked"],
      color: "bg-red-600",
      type: "Rocky"
    },
    {
      name: "TRAPPIST-1e",
      description: "Ocean world dominated by deep blue water with volcanic islands",
      features: ["Ocean World", "Volcanic Islands", "Dense Atmosphere"],
      color: "bg-blue-600",
      type: "Ocean World"
    },
    {
      name: "K2-18b",
      description: "Hycean water-world with thick hydrogen atmosphere",
      features: ["Water World", "Thick Atmosphere", "Hydrogen Rich"],
      color: "bg-indigo-800",
      type: "Hycean"
    }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Explorer
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Photorealistic Exoplanets
              </h1>
              <p className="text-sm text-gray-300">High-fidelity 3D planet rendering with advanced shaders</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </div>
        </div>
      </header>

      {/* Main 3D Scene */}
      <div className="fixed inset-0 pt-20">
        <PhotorealisticPlanets />
      </div>

      {/* Planet Features Panel */}
      <div className="fixed bottom-6 left-6 z-30 max-w-md">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Photorealistic Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planetFeatures.map((planet, index) => (
                <div key={index} className="p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${planet.color}`} />
                    <div className="text-white font-medium text-sm">{planet.name}</div>
                    <Badge variant="outline" className="text-xs border-white/20 text-white">
                      {planet.type}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{planet.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {planet.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-white/20 text-white">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Features Panel */}
      <div className="fixed top-20 right-6 z-30 max-w-sm">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Technical Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Three-layer mesh approach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Custom atmosphere shaders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span>Normal & roughness mapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span>Parallax cloud animation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span>Day/night cycle lighting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span>Fresnel rim lighting</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <div className="fixed top-20 left-6 z-30 max-w-sm">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Click planets to focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Mouse wheel to zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Drag to rotate view</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>Hover for planet info</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Photorealistic;
