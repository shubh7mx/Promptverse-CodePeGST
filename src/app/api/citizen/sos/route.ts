import { NextResponse } from 'next/server';
import { CitizenSosReport, DisasterIncident } from '@/types/disaster';
import { SwarmCoordinator } from '@/lib/agents/SwarmCoordinator';
import { addCitizenSosReport } from '@/lib/db/liveDataStore';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CitizenSosReport>;
    const coordinator = SwarmCoordinator.getInstance();

    const lat = body.coordinates?.lat || 19.8135;
    const lng = body.coordinates?.lng || 85.8421;

    // Persist to disk
    const savedReport = addCitizenSosReport({
      name: body.userName || 'Anonymous Citizen',
      phone: body.contact || '+91-XXXXX-XXXXX',
      headcount: body.headcount || 4,
      hazardType: body.hazardType || 'FLOOD',
      batteryLevelPct: 65,
      medicalEmergency: Boolean(body.medicalAssistanceRequired),
      lat,
      lng,
    });

    const newReport: CitizenSosReport = {
      id: savedReport.id,
      timestamp: savedReport.timestamp,
      userName: savedReport.name,
      contact: savedReport.phone,
      coordinates: { lat, lng },
      state: body.state || 'Odisha',
      district: body.district || 'Puri',
      hazardType: body.hazardType || 'FLOOD',
      headcount: savedReport.headcount,
      medicalAssistanceRequired: savedReport.medicalEmergency,
      notes: body.notes || 'Emergency rescue requested. Immediate evacuation assistance needed.',
      status: 'REPORTED',
    };

    // Synthesize as disaster incident to trigger Swarm immediately
    const incident: DisasterIncident = {
      id: `inc-sos-${Date.now()}`,
      category: newReport.hazardType,
      title: `EMERGENCY CITIZEN SOS: ${newReport.headcount} people trapped in ${newReport.district}`,
      state: newReport.state,
      district: newReport.district,
      location: newReport.coordinates,
      severity: 'RED',
      source: 'CITIZEN_SOS',
      timestamp: 'Just now',
      metrics: {
        riskScore: 98,
        confidence: 100,
        affectedPopulationEst: newReport.headcount,
      },
      details: `${newReport.notes} - Medical Help: ${newReport.medicalAssistanceRequired ? 'YES' : 'NO'}. Contact: ${newReport.contact}`,
    };

    // Execute swarm deliberation in background
    coordinator.executeSwarmDeliberation(incident);

    return NextResponse.json({
      success: true,
      reportId: newReport.id,
      message: 'SOS received, stored in live database, and dispatched to Swarm Orchestrator & NDRF Command.',
      report: newReport,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to process SOS' }, { status: 500 });
  }
}
