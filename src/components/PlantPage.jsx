import React, { useEffect, useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

const PLANTS_URL = "http://localhost:6001/plants";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(PLANTS_URL)
      .then((response) => response.json())
      .then((data) => {
        const normalizedPlants = data.map((plant) => ({
          ...plant,
          inStock: plant.inStock ?? true,
        }));
        setPlants(normalizedPlants);
      });
  }, []);

  const handleAddPlant = (newPlant) => {
    fetch(PLANTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlant),
    })
      .then((response) => response.json())
      .then((savedPlant) => {
        setPlants((currentPlants) => [
          ...currentPlants,
          {
            ...savedPlant,
            inStock: savedPlant.inStock ?? true,
          },
        ]);
      });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleToggleStock = (plantId) => {
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === plantId
          ? { ...plant, inStock: !plant.inStock }
          : plant
      )
    );
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search searchTerm={searchTerm} onSearch={handleSearchChange} />
      <PlantList plants={filteredPlants} onToggleStock={handleToggleStock} />
    </main>
  );
}

export default PlantPage;
