import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Briefcase, Fuel, Settings2, Star } from 'lucide-react';
import type { Car } from '../types';
import { formatCurrency, getCarTypeLabel } from '../lib/utils';

interface CarCardProps {
  car: Car;
  searchParams?: URLSearchParams;
}

export function CarCard({ car, searchParams }: Readonly<CarCardProps>) {
  const queryString = searchParams ? `?${searchParams.toString()}` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
          {getCarTypeLabel(car.type)}
        </div>
        <div className="absolute top-3 left-3 bg-blue-600 px-2 py-1 rounded-full text-xs font-semibold text-white flex items-center">
          <Star className="h-3 w-3 mr-1 fill-current" />
          {car.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{car.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{car.brand} {car.model} {car.year}</p>

        {/* Specs */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Users className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-600">{car.seats}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Briefcase className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-600">{car.luggage}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Fuel className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-600 uppercase">{car.fuelType[0]}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <Settings2 className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-xs text-gray-600 capitalize">{car.transmission[0]}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {car.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
          {car.features.length > 3 && (
            <span className="text-xs text-gray-500">+{car.features.length - 3}</span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Harga per hari</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(car.pricePerDay)}</p>
          </div>
          <Link
            to={`/cars/${car.id}${queryString}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
