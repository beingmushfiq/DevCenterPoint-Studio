import { Capability } from '../types';

export const CAPABILITIES_DATA: Capability[] = [
  {
    id: 'product-engineering',
    number: '01',
    title: 'Product Engineering',
    tagline: 'Full-stack SaaS, web applications, and mission-critical software systems.',
    description: 'We turn complex product requirements into resilient, performant, and maintainable software systems designed to scale gracefully with your business.',
    keyOutputs: [
      'SaaS Web Applications & Portals',
      'High-Performance REST & GraphQL APIs',
      'Microservices & Distributed Systems',
      'Legacy System Modernization'
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Laravel', 'PostgreSQL', 'Redis'],
    architectureHighlights: [
      'Clean Architecture / Hexagonal Service Layering',
      'Strict API Contract Definitions (OpenAPI / TypeSpec)',
      'Sub-100ms Server Response Targets',
      'Comprehensive Automated Test Suites'
    ],
    codeSample: `// Example: Atomic Transaction Handler with Optimistic Locking
export async function processOrderTx(orderData: OrderPayload) {
  return await db.transaction(async (trx) => {
    const stock = await trx('inventory')
      .where({ sku: orderData.sku })
      .forUpdate()
      .first();

    if (!stock || stock.available < orderData.qty) {
      throw new InsufficientStockError(orderData.sku);
    }

    await trx('inventory')
      .where({ sku: orderData.sku })
      .decrement('available', orderData.qty);

    const [order] = await trx('orders')
      .insert({ ...orderData, status: 'CONFIRMED' })
      .returning('*');

    await dispatchWebhook('order.created', order);
    return order;
  });
}`,
    iconName: 'Code2'
  },
  {
    id: 'ai-intelligent-systems',
    number: '02',
    title: 'AI & Intelligent Systems',
    tagline: 'Practical machine learning, predictive pipelines, and explainable AI models.',
    description: 'We embed predictive analytics, automated workflows, and explainable machine learning models directly into production applications to solve real business problems.',
    keyOutputs: [
      'Predictive Classification & Forecasting',
      'SHAP / LIME Model Explainability',
      'LLM API Integration & RAG Workflows',
      'Automated Data Ingestion Pipelines'
    ],
    techStack: ['Python', 'XGBoost', 'SHAP', 'PyTorch', 'FastAPI', 'Gemini API', 'PostgreSQL / pgvector'],
    architectureHighlights: [
      'Containerized ML Inference Micro-services',
      'Sub-200ms API Response Benchmarks',
      'Auditable Feature Contribution Breakdown',
      'Automated Model Retraining Pipelines'
    ],
    codeSample: `# Python FastAPI Inference Endpoint with SHAP Explainability
@app.post("/api/v1/predict-career")
async function predict_career(applicant: ApplicantPayload):
    features_df = prepare_features(applicant)
    prob = model.predict_proba(features_df)[0][1]
    
    # Generate SHAP values for explainability
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(features_df)
    
    return {
        "score": float(prob),
        "prediction": "RECOMMENDED" if prob > 0.65 else "REVIEW",
        "top_factors": format_shap_factors(shap_values[0], features_df.columns)
    }`,
    iconName: 'Cpu'
  },
  {
    id: 'experience-design',
    number: '03',
    title: 'Experience Design',
    tagline: 'Human-centered product design, design systems, and interaction design.',
    description: 'Design at DevCenterPoint is not decorative—it is structural. We create coherent, accessible, high-density interfaces engineered for speed, clarity, and delight.',
    keyOutputs: [
      'Product UI/UX Design Systems',
      'High-Fidelity Interactive Prototypes',
      'Information Architecture & Flow Mapping',
      'Accessibility Audits (WCAG 2.1 AA)'
    ],
    techStack: ['Figma', 'Tailwind CSS', 'Framer Motion', 'Radix UI', 'CSS Architecture'],
    architectureHighlights: [
      'Token-Driven Design Systems',
      'Strict Spatial Grid & Typography Scales',
      'Dark & Light Mode Contrast Verification',
      'Zero Layout Shift (CLS < 0.05)'
    ],
    codeSample: `/* Design System Token Contract */
:root {
  --color-brand-primary: #2E4AF9;
  --color-surface-dark: #000F26;
  --color-surface-card: #0B1220;
  --color-text-primary: #EEF1F5;
  --color-text-muted: #7C8493;
  --radius-card: 12px;
  --transition-editorial: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}`,
    iconName: 'Palette'
  },
  {
    id: 'business-systems',
    number: '04',
    title: 'Business Systems',
    tagline: 'Custom ERP, POS, CRM, and operational automation platforms.',
    description: 'Generic off-the-shelf software rarely fits specialized business workflows. We build tailored operational software that mirrors your exact organizational logic.',
    keyOutputs: [
      'Enterprise Resource Planning (ERP)',
      'Custom Point of Sale (POS) Systems',
      'B2B Customer Relationship Management (CRM)',
      'Inventory & Warehouse Management (WMS)'
    ],
    techStack: ['Laravel', 'React', 'MySQL', 'PostgreSQL', 'Redis', 'WebSockets'],
    architectureHighlights: [
      'Role-Based Access Control (RBAC) Matrices',
      'Immutable Financial & Transaction Audit Logs',
      'Offline-First Sync Protocols',
      'Custom Printable Invoice & Label Engines'
    ],
    codeSample: `// Role-Based Access Control Guard
public function handle($request, Closure $next, ...$permissions)
{
    $user = $request->user();
    if (!$user || !$user->hasAnyPermission($permissions)) {
        return response()->json(['error' => 'Forbidden: Unauthorized System Action'], 403);
    }
    return $next($request);
}`,
    iconName: 'Building2'
  },
  {
    id: 'commerce-infrastructure',
    number: '05',
    title: 'Commerce Infrastructure',
    tagline: 'Headless e-commerce, multi-vendor marketplaces, and payment gateways.',
    description: 'Fast, secure, and flexible commerce architectures built to handle catalog volume, complex pricing rules, and seamless international payment checkouts.',
    keyOutputs: [
      'Headless E-Commerce Backends',
      'Multi-Vendor Marketplace Infrastructure',
      'Custom Payment Gateway Integrations',
      'Automated Invoicing & Subscription Billing'
    ],
    techStack: ['Next.js', 'Node.js', 'GraphQL', 'Stripe API', 'PostgreSQL', 'Redis'],
    architectureHighlights: [
      'Sub-second Storefront Page Load Speed',
      'PSSI-DSS Compliant Payment Tokenization',
      'High-Concurrency Inventory Reservation',
      'Dynamic Multi-Currency & Tax Calculation'
    ],
    codeSample: `// Stripe Webhook Idempotency & Order Fulfill Handler
export async function handleStripeWebhook(event: Stripe.Event) {
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;
    
    // Idempotent processing check
    const processed = await redis.get(\`evt:\${event.id}\`);
    if (processed) return;

    await markOrderAsPaid(orderId, paymentIntent.id);
    await redis.set(\`evt:\${event.id}\`, '1', 'EX', 86400);
  }
}`,
    iconName: 'ShoppingBag'
  },
  {
    id: 'healthcare-technology',
    number: '06',
    title: 'Healthcare Technology',
    tagline: 'Queue management, clinic systems, and digital health workflows.',
    description: 'Digital solutions designed for medical environments prioritizing data privacy, real-time patient flow, clear displays, and high system reliability.',
    keyOutputs: [
      'Clinic & OPD Queue Management Platforms',
      'Patient Registration & Serial Issuance Kiosks',
      'Doctor Consultation Console Software',
      'Automated SMS & Remote Queue Trackers'
    ],
    techStack: ['Laravel', 'React', 'WebSockets', 'MySQL', 'Twilio API', 'Pusher'],
    architectureHighlights: [
      'Sub-Second Real-Time Display Sync',
      'HIPAA-Compliant Data Security Patterns',
      'Fail-Safe Queue Recovery Protocols',
      'High-Legibility Public Screen Views'
    ],
    codeSample: `// Real-Time Queue Broadcast Service
public function callNextToken($counterId, $doctorId) {
    $token = QueueToken::where('doctor_id', $doctorId)
        ->where('status', 'WAITING')
        ->orderBy('serial_number', 'asc')
        ->firstOrFail();

    $token->update(['status' => 'IN_CONSULTATION', 'counter_id' => $counterId]);
    
    broadcast(new TokenCalledEvent($token))->toOthers();
    return $token;
}`,
    iconName: 'Activity'
  },
  {
    id: 'mobile-platforms',
    number: '07',
    title: 'Mobile Platforms',
    tagline: 'Native performance, cross-platform apps, and IoT device integrations.',
    description: 'Fluid mobile applications engineered for iOS and Android, focusing on offline resilience, responsive touch UI, and hardware API connectivity.',
    keyOutputs: [
      'Cross-Platform iOS & Android Apps',
      'Offline-First Progressive Web Apps (PWA)',
      'GPS & Bluetooth IoT Telematics Apps',
      'Mobile Push Notification Infrastructure'
    ],
    techStack: ['React Native', 'TypeScript', 'PWA', 'Mapbox GL', 'Firebase Cloud Messaging'],
    architectureHighlights: [
      '60 FPS UI Animation Benchmarks',
      'Encrypted On-Device Local SQLite Storage',
      'Background Geolocation & Tracking Protocols',
      'Low Battery & Bandwidth Optimization'
    ],
    codeSample: `// React Native Geofence Background Tracking Hook
export function useBackgroundLocation(geofenceBounds: Polygon) {
  useEffect(() => {
    const watchId = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (loc) => {
        const isInside = checkPointInPolygon(loc.coords, geofenceBounds);
        if (isInside) triggerGeofenceAlert('ENTRY', loc.coords);
      }
    );
    return () => watchId.then(w => w.remove());
  }, [geofenceBounds]);
}`,
    iconName: 'Smartphone'
  },
  {
    id: 'cloud-infrastructure',
    number: '08',
    title: 'Cloud & Infrastructure',
    tagline: 'DevOps automation, Docker containerization, and zero-downtime deployments.',
    description: 'Stable cloud foundations that ensure high availability, automatic scaling, strict firewall security, and continuous delivery pipelines.',
    keyOutputs: [
      'Docker Containerization & Orchestration',
      'CI/CD Pipeline Setup (GitHub Actions / GitLab)',
      'Cloud Architecture (AWS / DigitalOcean / Vercel)',
      'Database Backup & Recovery Strategies'
    ],
    techStack: ['Docker', 'Nginx', 'Linux', 'GitHub Actions', 'AWS / Cloudflare', 'PostgreSQL'],
    architectureHighlights: [
      'Zero-Downtime Blue/Green Deployments',
      'Automated SSL Certificate Renewal',
      'Real-Time Health Monitoring & Alerts',
      'Strict Firewall & DDoS Protection Layers'
    ],
    codeSample: `# GitHub Actions CI/CD Production Build Pipeline
name: Production Deployment Pipeline
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker Container
        run: docker build -t app-prod:\${{ github.sha }} .
      - name: Run Automated Test Suite
        run: docker run app-prod:\${{ github.sha }} npm test
      - name: Zero-Downtime Rollout
        run: ./scripts/deploy-blue-green.sh \${{ github.sha }}`,
    iconName: 'Server'
  }
];
