import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiTrendingUp, FiClock, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { HiOutlineDocumentReport, HiOutlineLightningBolt } from 'react-icons/hi';
import { FaCarSide, FaIndustry, FaChartLine, FaCheck } from 'react-icons/fa';
import { MdElectricBolt, MdLocationCity, MdOutlineLocalGasStation } from 'react-icons/md';
import { RiGasBottleLine } from 'react-icons/ri';

// IPCC-based fuel emission factor data (global defaults)
const EMISSION_FACTORS = {
    diesel: { density: 0.84, gcv: 45.3, EF: 74100 },        // EF in kg CO2/TJ
    gasoline: { density: 0.74, gcv: 44.0, EF: 69300 },
    LPG: { density: 1.0, gcv: 49.3, EF: 63100 },
    naturalGas: { density: 0.714, gcv: 50.0, EF: 56100 }     // Approx
};

// Country-specific grid emission factors (kg CO2/kWh)
const GRID_FACTORS = {
    India: 0.716,
    US: 0.367,
    UK: 0.207,
    China: 0.537,
    Bali: 0.785,
    Bangkok: 0.399,
    Germany: 0.365
};

const COUNTRIES = Object.keys(GRID_FACTORS);

const KPIDashboard = () => {
    // State management
    const [country, setCountry] = useState('India');
    const [stationaryFuels, setStationaryFuels] = useState([
        { type: 'diesel', quantity: '', unit: 'liter' }
    ]);
    const [mobileFuels, setMobileFuels] = useState([
        { type: 'gasoline', quantity: '', unit: 'liter' }
    ]);
    const [electricitySources, setElectricitySources] = useState([
        { type: 'grid', quantity: '' }
    ]);
    const [results, setResults] = useState(null);
    const [showCalculator, setShowCalculator] = useState(true);

    // Functions to handle rows
    const addStationaryRow = () => {
        setStationaryFuels([...stationaryFuels, { type: 'diesel', quantity: '', unit: 'liter' }]);
    };

    const addMobileRow = () => {
        setMobileFuels([...mobileFuels, { type: 'gasoline', quantity: '', unit: 'liter' }]);
    };

    const addElectricityRow = () => {
        setElectricitySources([...electricitySources, { type: 'grid', quantity: '' }]);
    };

    const removeStationaryRow = (index) => {
        setStationaryFuels(stationaryFuels.filter((_, i) => i !== index));
    };

    const removeMobileRow = (index) => {
        setMobileFuels(mobileFuels.filter((_, i) => i !== index));
    };

    const removeElectricityRow = (index) => {
        setElectricitySources(electricitySources.filter((_, i) => i !== index));
    };

    // Update field handlers
    const updateStationaryFuel = (index, field, value) => {
        const newFuels = [...stationaryFuels];
        newFuels[index][field] = value;
        setStationaryFuels(newFuels);
    };

    const updateMobileFuel = (index, field, value) => {
        const newFuels = [...mobileFuels];
        newFuels[index][field] = value;
        setMobileFuels(newFuels);
    };

    const updateElectricity = (index, field, value) => {
        const newSources = [...electricitySources];
        newSources[index][field] = value;
        setElectricitySources(newSources);
    };

    // Calculate emissions
    const calculateFuelEmission = (fuelType, quantity, unit) => {
        const factor = EMISSION_FACTORS[fuelType];
        if (!factor || quantity <= 0) return 0;

        let massKg;
        if (unit === 'liter') massKg = quantity * factor.density;
        else if (unit === 'kg') massKg = quantity;
        else if (unit === 'gallon') massKg = quantity * 3.785 * factor.density;
        else massKg = quantity;

        const energyTJ = (massKg * factor.gcv) / 1_000_000;
        const emissions = (energyTJ * factor.EF) / 1000; // tons CO2
        return emissions;
    };

    const calculateEmissions = () => {
        // Scope 1 - Stationary
        const stationaryEmissions = stationaryFuels.reduce((total, fuel) => {
            const emission = calculateFuelEmission(
                fuel.type,
                parseFloat(fuel.quantity) || 0,
                fuel.unit
            );
            return total + emission;
        }, 0);

        // Scope 1 - Mobile
        const mobileEmissions = mobileFuels.reduce((total, fuel) => {
            const emission = calculateFuelEmission(
                fuel.type,
                parseFloat(fuel.quantity) || 0,
                fuel.unit
            );
            return total + emission;
        }, 0);

        // Scope 2 - Electricity
        const gridFactor = GRID_FACTORS[country] || GRID_FACTORS['India'];
        const electricityEmissions = electricitySources.reduce((total, source) => {
            const quantity = parseFloat(source.quantity) || 0;
            const mwh = quantity / 1000;
            const emission = source.type === 'grid' ? mwh * gridFactor : 0;
            return total + emission;
        }, 0);

        const totalEmissions = stationaryEmissions + mobileEmissions + electricityEmissions;

        // Set the results
        setResults({
            stationaryEmissions,
            mobileEmissions,
            electricityEmissions,
            totalEmissions
        });
    };

    return (
        <div className="container mx-auto ">
            {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">KPI Dashboard</h1> */}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 hidden">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Environmental</h3>
                            <div className="p-2 bg-white bg-opacity-30 rounded-lg">
                                <FaIndustry className="text-white text-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <div className="h-2 bg-gray-200 rounded-full mb-2">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>ESG Performance</span>
                            <span className="font-medium">75%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Social</h3>
                            <div className="p-2 bg-white bg-opacity-30 rounded-lg">
                                <MdLocationCity className="text-white text-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <div className="h-2 bg-gray-200 rounded-full mb-2">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>ESG Performance</span>
                            <span className="font-medium">68%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Quality</h3>
                            <div className="p-2 bg-white bg-opacity-30 rounded-lg">
                                <FaChartLine className="text-white text-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4">
                        <div className="h-2 bg-gray-200 rounded-full mb-2">
                            <div className="h-2 bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>ESG Performance</span>
                            <span className="font-medium">82%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carbon Calculator */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
                    <h2 className="text-xl font-bold flex items-center">
                        <HiOutlineDocumentReport className="mr-2 text-2xl" />
                        Scope 1 & Scope 2 Carbon Calculator
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">
                        Measure your organization's direct and indirect greenhouse gas emissions
                    </p>
                </div>

                <div className="p-6">
                    {/* Country Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country:</label>
                        <select
                            className="block w-full md:w-1/3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            {COUNTRIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Scope 1: Stationary Combustion */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                            <FaIndustry className="mr-2 text-gray-600" />
                            Scope 1: Stationary Combustion
                        </h3>

                        {stationaryFuels.map((fuel, index) => (
                            <div key={`stationary-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                                <div>
                                    <select
                                        className="block w-full bg-white border border-gray-300 rounded-lg p-2.5"
                                        value={fuel.type}
                                        onChange={(e) => updateStationaryFuel(index, 'type', e.target.value)}
                                    >
                                        <option value="diesel">Diesel</option>
                                        <option value="LPG">LPG</option>
                                        <option value="naturalGas">Natural Gas</option>
                                        <option value="gasoline">Gasoline</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        className="block w-full bg-white border border-gray-300 rounded-lg p-2.5"
                                        value={fuel.quantity}
                                        onChange={(e) => updateStationaryFuel(index, 'quantity', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <select
                                        className="block w-full bg-white border border-gray-300 rounded-lg p-2.5"
                                        value={fuel.unit}
                                        onChange={(e) => updateStationaryFuel(index, 'unit', e.target.value)}
                                    >
                                        <option value="liter">Liter</option>
                                        <option value="kg">kg</option>
                                        <option value="gallon">Gallon</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className="p-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeStationaryRow(index)}
                                    >
                                        <FiMinusCircle className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            onClick={addStationaryRow}
                        >
                            <FiPlusCircle className="mr-1" /> Add Stationary Fuel
                        </button>
                    </div>

                    {/* Scope 1: Mobile Combustion */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                            <FaCarSide className="mr-2 text-gray-600" />
                            Scope 1: Mobile Combustion
                        </h3>

                        {mobileFuels.map((fuel, index) => (
                            <div key={`mobile-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                                <div>
                                    <select
                                        className="block w-full bg-white border border-gray-300 rounded-lg p-2.5"
                                        value={fuel.type}
                                        onChange={(e) => updateMobileFuel(index, 'type', e.target.value)}
                                    >
                                        <option value="diesel">Diesel</option>
                                        <option value="gasoline">Gasoline</option>
                                        <option value="naturalGas">Natural Gas</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        className="block w-full bg-white border border-gray-300 rounded-lg p-2.5"
                                        value={fuel.quantity}
                                        onChange={(e) => updateMobileFuel(index, 'quantity', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <select
                                        className="block w-full bg-white border border-gray-300 rounded-lg p-2.5"
                                        value={fuel.unit}
                                        onChange={(e) => updateMobileFuel(index, 'unit', e.target.value)}
                                    >
                                        <option value="liter">Liter</option>
                                        <option value="kg">kg</option>
                                        <option value="gallon">Gallon</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className="p-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeMobileRow(index)}
                                    >
                                        <FiMinusCircle className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            onClick={addMobileRow}
                        >
                            <FiPlusCircle className="mr-1" /> Add Mobile Fuel
                        </button>
                    </div>

                    {/* Scope 2: Purchased Electricity */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                            <MdElectricBolt className="mr-2 text-gray-600" />
                            Scope 2: Purchased Electricity
                        </h3>

                        {electricitySources.map((source, index) => (
                            <div key={`electricity-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                <div>
                                    <select
                                        className="block w-full bg-white border border-gray-300 rounded-lg p-2.5"
                                        value={source.type}
                                        onChange={(e) => updateElectricity(index, 'type', e.target.value)}
                                    >
                                        <option value="grid">Grid Electricity</option>
                                        <option value="renewable">Renewable</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="kWh"
                                        className="block w-full bg-white border border-gray-300 rounded-lg p-2.5"
                                        value={source.quantity}
                                        onChange={(e) => updateElectricity(index, 'quantity', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className="p-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeElectricityRow(index)}
                                    >
                                        <FiMinusCircle className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            onClick={addElectricityRow}
                        >
                            <FiPlusCircle className="mr-1" /> Add Electricity Source
                        </button>
                    </div>

                    {/* Calculate Button */}
                    <div className="flex justify-center">
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                            onClick={calculateEmissions}
                        >
                            <HiOutlineLightningBolt className="mr-2" /> Calculate Emissions
                        </button>
                    </div>

                    {/* Results */}
                    {results && (
                        <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <div className="bg-blue-600 text-white px-4 py-3">
                                <h3 className="font-semibold text-lg">Carbon Emissions Results</h3>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 text-sm">Stationary Combustion</span>
                                            <FaIndustry className="text-blue-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-800">{results.stationaryEmissions.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">Tonnes CO₂</div>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 text-sm">Mobile Combustion</span>
                                            <FaCarSide className="text-green-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-800">{results.mobileEmissions.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">Tonnes CO₂</div>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 text-sm">Electricity</span>
                                            <MdElectricBolt className="text-yellow-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-800">{results.electricityEmissions.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">Tonnes CO₂</div>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg shadow border border-gray-100 bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-700 font-medium">Total Emissions</span>
                                            <FaChartLine className="text-indigo-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-indigo-700">{results.totalEmissions.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">Tonnes CO₂</div>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-dashed border-gray-300 pt-4 text-sm text-gray-600">
                                    <p>These calculations are based on internationally recognized emission factors and methodologies. For detailed reporting or verification purposes, please consult with an environmental professional.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default KPIDashboard; 