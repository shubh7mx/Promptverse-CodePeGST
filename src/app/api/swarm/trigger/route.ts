import { NextResponse } from 'next/server';
import { SwarmCoordinator } from '@/lib/agents/SwarmCoordinator';
import { DisasterIncident } from '@/types/disaster';
import { INITIAL_INCIDENTS } from '@/lib/store/useDisasterStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const coordinator = SwarmCoordinator.getInstance();

    let incident: DisasterIncident;

    if (body.incidentId) {
      const found = INITIAL_INCIDENTS.find((inc) => inc.id === body.incidentId);
      incident = found || INITIAL_INCIDENTS[0];
    } else if (body.category && body.district) {
      incident = {
        id: body.id || `inc-${Date.now()}`,
        category: body.category,
        title: body.title || `${body.category} Alert in ${body.district}`,
        state: body.state || 'India',
        district: body.district,
        location: body.location || { lat: 20.5937, lng: 78.9629 },
        severity: body.severity || 'ORANGE',
        source: body.source || 'IMD',
        timestamp: body.timestamp || 'Just now',
        metrics: body.metrics || { riskScore: 75, confidence: 90 },
        details: body.details || `Swarm deliberation dispatched for ${body.district}.`,
      };
    } else {
      incident = INITIAL_INCIDENTS[0];
    }

    // Trigger full multi-agent consensus
    const blackboard = await coordinator.executeSwarmDeliberation(incident);

    return NextResponse.json({
      success: true,
      incident,
      blackboard,
      agents: coordinator.getAgents(),
      thoughtLogs: coordinator.getThoughtLogs().slice(0, 10),
    });
  } catch (err) {
    console.error('Error triggering swarm:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger swarm deliberation' },
      { status: 500 }
    );
  }
}
