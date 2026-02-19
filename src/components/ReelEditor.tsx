"use client";

import { useReelStore } from "@/store/useReelStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, RotateCcw } from "lucide-react";

export function ReelEditor() {
    const {
        text, setText,
        fontSize, setFontSize,
        backgroundColor, setBackgroundColor,
        textColor, setTextColor,
        duration, setDuration,
        reset
    } = useReelStore();

    return (
        <Card className="w-80 bg-zinc-900/50 border-zinc-800 backdrop-blur-xl text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Editor Settings
                </CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={reset}
                    className="h-8 w-8 hover:bg-zinc-800"
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Text Content</label>
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="bg-black/50 border-zinc-800 focus:ring-purple-500"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <label className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Font Size</label>
                        <span className="text-xs text-purple-400">{fontSize}px</span>
                    </div>
                    <Slider
                        value={[fontSize]}
                        onValueChange={(val) => setFontSize(val[0])}
                        max={200}
                        min={12}
                        step={1}
                        className="cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Background</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-full h-8 bg-transparent rounded cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Text Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-full h-8 bg-transparent rounded cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <label className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Duration</label>
                        <span className="text-xs text-purple-400">{duration}s</span>
                    </div>
                    <Slider
                        value={[duration]}
                        onValueChange={(val) => setDuration(val[0])}
                        max={30}
                        min={1}
                        step={0.5}
                        className="cursor-pointer"
                    />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0">
                    Generate Reel
                </Button>
            </CardContent>
        </Card>
    );
}
