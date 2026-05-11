import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Plus, Trash2, Car as CarIcon, Save, Image as ImageIcon, Link, Loader2 } from 'lucide-react';
import type { Car } from '../types';

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (car: Partial<Car>) => void;
  car?: Car | null;
  isSaving?: boolean;
}

const carTypes = [
  { value: 'economy', label: 'Economy' },
  { value: 'compact', label: 'Compact' },
  { value: 'midsize', label: 'Midsize' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'van', label: 'Van' }
];

const fuelTypes = [
  { value: 'petrol', label: 'Bensin' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Listrik' }
];

const featuresList = [
  'AC', 'Power Steering', 'ABS', 'Airbags', 'Audio System', 
  'Bluetooth', 'GPS Navigation', 'Reverse Camera', 'Sunroof', 
  'Leather Seats', 'Cruise Control', 'Parking Sensors',
  'Keyless Entry', 'Push Start', 'Heated Seats'
];

export function CarFormModal({ isOpen, onClose, onSave, car, isSaving = false }: CarFormModalProps) {
  const [formData, setFormData] = useState<Partial<Car>>({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'compact',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 5,
    luggage: 2,
    pricePerDay: 0,
    images: [],
    features: [],
    description: '',
    availability: true,
    rating: 4.5,
    reviewCount: 0,
    location: 'Jakarta'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (car) {
      setFormData({ ...car });
    } else {
      setFormData({
        name: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'compact',
        transmission: 'automatic',
        fuelType: 'petrol',
        seats: 5,
        luggage: 2,
        pricePerDay: 0,
        images: [],
        features: [],
        description: '',
        availability: true,
        rating: 4.5,
        reviewCount: 0,
        location: 'Jakarta'
      });
    }
    setErrors({});
    setImageUrl('');
  }, [car, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Nama mobil wajib diisi';
    if (!formData.brand?.trim()) newErrors.brand = 'Merek wajib diisi';
    if (!formData.model?.trim()) newErrors.model = 'Model wajib diisi';
    if (!formData.year || formData.year < 2000 || formData.year > 2030) {
      newErrors.year = 'Tahun tidak valid';
    }
    if (!formData.pricePerDay || formData.pricePerDay < 1) {
      newErrors.pricePerDay = 'Harga harus lebih dari 0';
    }
    if (!formData.images || formData.images.length === 0) {
      newErrors.images = 'Minimal 1 gambar diperlukan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          continue;
        }

        // Convert to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
        });
        
        reader.readAsDataURL(file);
        const base64 = await base64Promise;
        newImages.push(base64);
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <CarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {car ? 'Edit Mobil' : 'Tambah Mobil Baru'}
              </h2>
              <p className="text-blue-100 text-sm">
                {car ? 'Perbarui informasi mobil' : 'Isi detail mobil baru'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600 text-sm">1</span>
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nama Mobil *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.name ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Contoh: Toyota Avanza"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Merek *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.brand ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Contoh: Toyota"
                  />
                  {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.model ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Contoh: Avanza"
                  />
                  {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tahun *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.year ? 'border-red-500' : 'border-slate-200'
                    }`}
                    min="2000"
                    max="2030"
                  />
                  {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600 text-sm">2</span>
                Spesifikasi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tipe Mobil</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {carTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Transmisi</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value as any })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bahan Bakar</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {fuelTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah Kursi</label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    min="2"
                    max="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Kapasitas Bagasi</label>
                  <input
                    type="number"
                    value={formData.luggage}
                    onChange={(e) => setFormData({ ...formData, luggage: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Harga per Hari (Rp) *</label>
                  <input
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                      errors.pricePerDay ? 'border-red-500' : 'border-slate-200'
                    }`}
                    min="1"
                    placeholder="350000"
                  />
                  {errors.pricePerDay && <p className="mt-1 text-sm text-red-600">{errors.pricePerDay}</p>}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600 text-sm">3</span>
                Gambar Mobil *
              </h3>
              
              {/* Upload Method Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                    uploadMethod === 'file'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                    uploadMethod === 'url'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Link className="h-4 w-4 mr-2" />
                  URL
                </button>
              </div>

              {errors.images && <p className="text-sm text-red-600 mb-3">{errors.images}</p>}

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="w-full p-8 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
                        <span className="text-slate-600">Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                          <Upload className="h-7 w-7 text-blue-600" />
                        </div>
                        <span className="font-medium text-slate-700">Klik untuk upload gambar</span>
                        <span className="text-sm text-slate-500 mt-1">atau drag and drop file di sini</span>
                        <span className="text-xs text-slate-400 mt-2">Maksimal 5MB per file</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* URL Input */}
              {uploadMethod === 'url' && (
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/car-image.jpg"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Tambah
                  </button>
                </div>
              )}
              
              {/* Image Preview Grid */}
              {formData.images && formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    {formData.images.length} gambar dipilih
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={img}
                          alt={`Car ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-lg">
                            Utama
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-blue-600 text-sm">4</span>
                Fitur & Deskripsi
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Fitur Mobil</label>
                  <div className="flex flex-wrap gap-2">
                    {featuresList.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.features?.includes(feature)
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Deskripsi singkat tentang mobil..."
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center p-4 bg-slate-50 rounded-xl">
              <label className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded-lg border-slate-300 focus:ring-blue-500"
                />
                <span className="ml-3 font-medium text-slate-700">Tersedia untuk disewa</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {car ? 'Simpan Perubahan' : 'Tambah Mobil'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
