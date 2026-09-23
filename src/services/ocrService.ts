import { ExtractedBillData } from '../types';

export interface SampleBillTemplate {
  id: string;
  name: string;
  seller: string;
  thumbnail: string;
  extracted: ExtractedBillData;
}

export const SAMPLE_BILLS: SampleBillTemplate[] = [
  {
    id: 'sample-1',
    name: 'LG Washing Machine 8kg Bill (Reliance Digital)',
    seller: 'Reliance Digital Bellandur',
    thumbnail: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&auto=format&fit=crop&q=80',
    extracted: {
      productName: 'LG Washing Machine 8kg Front Load',
      serialNumber: 'LGWM98744',
      purchaseDate: '2026-06-12',
      seller: 'Reliance Digital Retail Ltd, Bellandur, Bangalore',
      purchaseAmount: '38,990',
      warrantyPeriodMonths: 24,
      confidenceScore: 98.4
    }
  },
  {
    id: 'sample-2',
    name: 'Samsung Refrigerator 324L (Croma Retail)',
    seller: 'Croma Retail Koramangala',
    thumbnail: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=200&auto=format&fit=crop&q=80',
    extracted: {
      productName: 'Samsung Frost Free Refrigerator 324L',
      serialNumber: 'SM-REF-55421',
      purchaseDate: '2026-08-01',
      seller: 'Infiniti Retail Ltd (Croma), Koramangala',
      purchaseAmount: '34,500',
      warrantyPeriodMonths: 24,
      confidenceScore: 96.8
    }
  },
  {
    id: 'sample-3',
    name: 'Daikin 1.5 Ton AC Bill (Vijay Sales)',
    seller: 'Vijay Sales Indiranagar',
    thumbnail: 'https://images.unsplash.com/photo-1614633837774-4b5f8ea5825a?w=200&auto=format&fit=crop&q=80',
    extracted: {
      productName: 'Daikin 1.5 Ton 5 Star Inverter AC',
      serialNumber: 'DKN-AC-99312',
      purchaseDate: '2026-04-18',
      seller: 'Vijay Sales Bangalore Hub',
      purchaseAmount: '44,200',
      warrantyPeriodMonths: 36,
      confidenceScore: 99.1
    }
  }
];

export async function simulateOcrExtraction(
  fileOrSampleId: File | string,
  onProgress: (status: string, percent: number) => void
): Promise<ExtractedBillData> {
  // Step 1: Uploading & Preprocessing
  onProgress('Reading document & optical preprocessing...', 20);
  await new Promise(r => setTimeout(r, 600));

  // Step 2: OCR Scanning
  onProgress('Detecting text regions and invoice headers...', 50);
  await new Promise(r => setTimeout(r, 700));

  // Step 3: Entity Extraction
  onProgress('Extracting Serial Number, Purchase Date & Warranty terms...', 85);
  await new Promise(r => setTimeout(r, 600));

  // Step 4: Verification & Finish
  onProgress('✓ Bill details extracted successfully', 100);
  await new Promise(r => setTimeout(r, 400));

  if (typeof fileOrSampleId === 'string') {
    const found = SAMPLE_BILLS.find(b => b.id === fileOrSampleId);
    if (found) return found.extracted;
  }

  // If a user uploaded an arbitrary custom file, generate realistic extraction based on file name or generic
  const fileName = typeof fileOrSampleId === 'object' ? fileOrSampleId.name : 'Invoice.pdf';
  const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

  const randomSerial = 'SN-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-2026';
  
  return {
    productName: cleanName.length > 3 ? cleanName.toUpperCase() : 'Premium Smart Appliance',
    serialNumber: randomSerial,
    purchaseDate: new Date().toISOString().split('T')[0],
    seller: 'Official Authorized Electronics Dealer',
    purchaseAmount: '29,990',
    warrantyPeriodMonths: 24,
    confidenceScore: 97.2
  };
}
