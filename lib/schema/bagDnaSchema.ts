export type SealStatus = "intact" | "authorized inspection" | "broken" | "replaced" | "invalid";
export type CheckpointName = "Check-in Counter" | "Conveyor Intake" | "Screening" | "Sorting Hub" | "Loading Bay" | "Aircraft Cargo Hold" | "Transfer Arrival" | "Arrival Scan" | "Belt Assignment" | "Passenger Claim";

export interface PassengerIdentityRef { id: string; name: string; passportRef: string; boardingPassRef: string; }
export interface FlightRef { flightNumber: string; origin: string; destination: string; departure: string; }
export interface BagPhysicalProfile { weightKg: number; dimensionsCm: [number, number, number]; color: string; sizeClass: string; shellType: string; handleType: string; wheelType: string; scratches: string[]; stickers: string[]; dents: string[]; markings: string[]; brandIndicators: string[]; imageRef?: string; }
export interface TagToken { id: string; encryptedToken: string; issuedAt: string; status: "Issued and Bound" | "suspended"; visibleFlightNumber: string; }
export interface RfidCredential { uid: string; status: "active" | "mismatch"; }
export interface NfcCredential { uid: string; status: "active" | "mismatch"; }
export interface RotatingQrCredential { payload: string; validFrom: string; validUntil: string; rotationSeconds: number; }
export interface TamperSeal { id: string; bagDnaId: string; status: SealStatus; activatedBy: string; activatedAt: string; lastEvent: string; }
export interface VisualFingerprint { id: string; bagDnaId: string; profile: BagPhysicalProfile; confidence: number; capturedAt: string; }
export interface StaffActor { id: string; name: string; role: string; assignedZone: string; actualZone: string; }
export interface CustodyEvent { id: string; bagDnaId: string; checkpoint: CheckpointName; actualCheckpoint: CheckpointName; timestamp: string; actor: StaffActor; device: string; rfidMatch: boolean; nfcMatch: boolean; qrValid: boolean; weightMatch: boolean; visualMatch: number; sealStatus: SealStatus; timeSinceLastScanMinutes: number; unauthorizedGap: boolean; confidence: number; eventHash: string; risk?: string; }
export interface CheckpointScan { credential: string; checkpoint: CheckpointName; weightKg: number; sealStatus: SealStatus; visualProfile?: BagPhysicalProfile; actor: StaffActor; device: string; }
export interface MismatchAlert { id: string; bagDnaId: string; scenario: string; expected: string; detected: string; reason: string; recommendedAction: string; evidence: string[]; severity: "medium" | "high" | "critical"; }
export interface EvidenceLedgerEvent { id: string; eventType: string; bagDnaId: string; actor: string; checkpoint: string; timestamp: string; verificationSummary: string; previousHash: string; currentHash: string; integrityStatus: "Verified" | "Review"; }
export interface DigitalBaggageIdentity { bagDnaId: string; passenger: PassengerIdentityRef; flight: FlightRef; physicalProfile: BagPhysicalProfile; tag: TagToken; rfid: RfidCredential; nfc: NfcCredential; qr: RotatingQrCredential; seal: TamperSeal; fingerprint: VisualFingerprint; custodyEvents: CustodyEvent[]; riskScore: number; ledger: EvidenceLedgerEvent[]; }

