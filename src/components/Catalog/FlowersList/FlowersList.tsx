import { FlowerButton } from "./FlowerButton";
import { useState, useEffect } from "react";
import "./FlowersList.css";

interface FlowersListProps {
  selectedColors?: number[];
  searchQuery?: string;
  selectedTypes?: number[];
}

interface FlowerData {
  id: string;
  title: string;
  x: number;
  y: number;
  colorId: number;
  flower_type_id: number;
}

export const FlowersList = ({
  selectedColors = [],
  searchQuery = "",
  selectedTypes = []
}: FlowersListProps) => {
  const [allFlowers, setAllFlowers] = useState<FlowerData[]>([]);
  const hardcodedFlowers: FlowerData[] = [
    {id: "0", title: "Роза розовая", x: 0, y: 0, colorId: 5, flower_type_id: 1},
    {id: "1", title: "Роза жёлтая", x: 100, y: 0, colorId: 1, flower_type_id: 1},
    {id: "2", title: "Роза оранжевая", x: 200, y: 0, colorId: 3, flower_type_id: 1},
    {id: "3", title: "Роза белая", x: 300, y: 0, colorId: 13, flower_type_id: 1}
  ];

  useEffect(() => {
    const loadFlowers = async () => {
      if ((window as any).electronAPI) {
        try {
          const flowersFromDB = await (window as any).electronAPI.getFlowers();
          const transformedFlowers = flowersFromDB.map((flower: any, index: number) => ({
            id: flower.id?.toString() || index.toString(),
            title: flower.title || `Цветок ${index}`,
            x: flower.x || 0,
            y: flower.y || 0,
            colorId: flower.colorId || 1,
            flower_type_id: flower.flower_type_id || 1
          }));
          setAllFlowers(transformedFlowers);
        }
        catch (error) {
          console.error("Ошибка получения цветов:", error);
          setAllFlowers(hardcodedFlowers);
        }
      } else {
        setAllFlowers(hardcodedFlowers);
      }
    };
    loadFlowers();
  }, []);

  const filteredFlowers = allFlowers.filter(flower => {
    const matchesColor = flower.colorId === 13 || selectedColors.includes(flower.colorId);
    const matchesSearch = searchQuery === "" ||
      flower.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 ||
      selectedTypes.includes(flower.flower_type_id);
    return matchesColor && matchesSearch && matchesType;
  });


  return (
    <div className="flowers-list-container">
      <div className="flowers-list-grid">
        {filteredFlowers.map((flower) => (
          <FlowerButton
            key={flower.id}
            id={flower.id}
            title={flower.title}
            x={flower.x}
            y={flower.y}
            colorId={flower.colorId}
            flower_type_id={flower.flower_type_id}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};