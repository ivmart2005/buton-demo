import "./SaturationSlider.css";

interface SaturationSliderProps {
  saturation: number;
  onSaturationChange: (saturation: number) => void;
  width?: number;
}

export const SaturationSlider = ({
  saturation,
  onSaturationChange,
  width = 195
}: SaturationSliderProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    onSaturationChange(value);
  };

  const fillPercent = ((saturation - 0.5) / 1) * 100;

  return (
    <div className="saturation-slider-container" style={{ width }}>
      <div className="saturation-header">
        <img
          src="./images/interface/saturation-icon.svg"
          alt="Насыщенность"
          className="saturation-icon"
        />
        <span className="saturation-label">Насыщенность</span>
      </div>
      <input
        type="range"
        min="0.5"
        max="1.5"
        step="any"
        value={saturation}
        onChange={handleChange}
        className="saturation-slider"
        style={{ "--fill": `${fillPercent}%` } as React.CSSProperties} // для заполнения слайдера цветом по серому
      />
    </div>
  );
};