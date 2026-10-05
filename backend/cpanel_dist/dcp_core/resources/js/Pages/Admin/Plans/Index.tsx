import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Star,
  Clock,
  Users,
  Shield,
  Layers,
  Sparkles,
  DollarSign,
  AlertTriangle,
  Check,
} from 'lucide-react';

export interface PlanItem {
  id: number;
  slug: string;
  name: string;
  badge?: string | null;
  tagline?: string | null;
  description?: string | null;
  pricing_model: 'custom' | 'fixed' | 'monthly' | 'milestone';
  price_usd?: string | null;
  price_eur?: string | null;
  price_gbp?: string | null;
  price_bdt?: string | null;
  billing_period?: string | null;
  timeline_estimate?: string | null;
  squad_composition?: string | null;
  sla_commitment?: string | null;
  recommended_for?: string | null;
  features?: string[] | null;
  cta_text?: string | null;
  cta_action?: string | null;
  cta_url?: string | null;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
}

interface Props {
  plans: PlanItem[];
  showPricingOnSite: boolean;
  pricingSectionHeading: string;
  pricingSectionSubheading: string;
}

export default function PlansIndex({
  plans = [],
  showPricingOnSite = false,
  pricingSectionHeading = '',
  pricingSectionSubheading = '',
}: Props) {
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdatingMasterToggle, setIsUpdatingMasterToggle] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    badge: '',
    tagline: '',
    description: '',
    pricing_model: 'milestone' as PlanItem['pricing_model'],
    price_usd: '',
    price_eur: '',
    price_gbp: '',
    price_bdt: '',
    billing_period: 'phased milestone',
    timeline_estimate: '8 – 12 Weeks',
    squad_composition: '1 Architect + 2 Fullstack Engineers + 1 QA',
    sla_commitment: '99.9% Uptime Guarantee',
    recommended_for: '',
    features: ['High-Throughput Distributed Architecture', 'Full End-to-End Test Suite', 'Automated Zero-Downtime Deployments'],
    cta_text: 'Inquire About Plan',
    cta_action: 'contact',
    cta_url: '',
    display_order: 1,
    is_featured: false,
    is_published: false,
  });

  const [newFeatureInput, setNewFeatureInput] = useState('');

  const openCreate = () => {
    setFormData({
      name: '',
      slug: '',
      badge: '',
      tagline: '',
      description: '',
      pricing_model: 'milestone',
      price_usd: '',
      price_eur: '',
      price_gbp: '',
      price_bdt: '',
      billing_period: 'phased milestone',
      timeline_estimate: '8 – 12 Weeks',
      squad_composition: '1 Architect + 2 Fullstack Engineers + 1 QA',
      sla_commitment: '99.9% Uptime Guarantee',
      recommended_for: '',
      features: ['Production Architecture & Schemas', 'Automated CI/CD Pipeline', 'Full Source Code & IP Handover'],
      cta_text: 'Inquire About Plan',
      cta_action: 'contact',
      cta_url: '',
      display_order: plans.length + 1,
      is_featured: false,
      is_published: false,
    });
    setEditingPlan(null);
    setIsCreating(true);
  };

  const openEdit = (plan: PlanItem) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      slug: plan.slug,
      badge: plan.badge || '',
      tagline: plan.tagline || '',
      description: plan.description || '',
      pricing_model: plan.pricing_model,
      price_usd: plan.price_usd || '',
      price_eur: plan.price_eur || '',
      price_gbp: plan.price_gbp || '',
      price_bdt: plan.price_bdt || '',
      billing_period: plan.billing_period || '',
      timeline_estimate: plan.timeline_estimate || '',
      squad_composition: plan.squad_composition || '',
      sla_commitment: plan.sla_commitment || '',
      recommended_for: plan.recommended_for || '',
      features: Array.isArray(plan.features) ? [...plan.features] : [],
      cta_text: plan.cta_text || 'Inquire About Plan',
      cta_action: plan.cta_action || 'contact',
      cta_url: plan.cta_url || '',
      display_order: plan.display_order,
      is_featured: plan.is_featured,
      is_published: plan.is_published,
    });
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      router.put(`/admin/plans/${editingPlan.id}`, formData, {
        preserveScroll: true,
        onSuccess: () => setEditingPlan(null),
      });
    } else {
      router.post('/admin/plans', formData, {
        preserveScroll: true,
        onSuccess: () => setIsCreating(false),
      });
    }
  };

  const handleTogglePublish = (plan: PlanItem) => {
    router.patch(`/admin/plans/${plan.id}/publish`, {}, {
      preserveScroll: true,
    });
  };

  const handleDelete = (plan: PlanItem) => {
    if (confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
      router.delete(`/admin/plans/${plan.id}`, {
        preserveScroll: true,
      });
    }
  };

  const handleToggleMasterSitePricing = (newVal: boolean) => {
    const confirmation = newVal
      ? 'Publish the pricing and plans section to the live public website?'
      : 'Hide all pricing and plans from the public site? (Inquiry Builder will stay in Scope & Velocity mode without prices)';

    if (confirm(confirmation)) {
      setIsUpdatingMasterToggle(true);
      router.post('/admin/plans/site-pricing', {
        show_pricing: newVal,
        heading: pricingSectionHeading,
        subheading: pricingSectionSubheading,
      }, {
        preserveScroll: true,
        onFinish: () => setIsUpdatingMasterToggle(false),
      });
    }
  };

  const addFeature = () => {
    if (newFeatureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeatureInput.trim()],
      });
      setNewFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== idx),
    });
  };

  return (
    <AdminLayout title="Plans & Pricing Packages CMS">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Plans & Commercial Packages
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure multi-currency pricing packages, deliverables, squad velocity, and public site visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Plan</span>
            </button>
          </div>
        </div>

        {/* Master Public Visibility Controller */}
        <div className={`p-6 rounded-3xl border transition-all ${
          showPricingOnSite
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-amber-950/15 border-amber-500/20'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full animate-pulse ${
                  showPricingOnSite ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' : 'bg-amber-400'
                }`} />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  Public Website Status: {showPricingOnSite ? '🟢 Pricing Section is LIVE' : '🔴 Pricing Section is HIDDEN'}
                </h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {showPricingOnSite
                  ? 'Active published plans and multi-currency amounts are currently visible to prospective clients on the public homepage.'
                  : 'All direct pricing and dollar numbers are concealed from the public site. The Inquiry Builder operates in "Engagement Scope & Delivery Velocity" mode for custom architect consultation.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={isUpdatingMasterToggle}
                onClick={() => handleToggleMasterSitePricing(!showPricingOnSite)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                  showPricingOnSite
                    ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                }`}
              >
                {showPricingOnSite ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Conceal Pricing From Site</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Publish Pricing to Public Site</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Configured Plans & Packages ({plans.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {plans.filter(p => p.is_published).length} Published · {plans.filter(p => !p.is_published).length} Draft
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0c101c] border border-white/10 space-y-3">
              <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-white">No commercial plans created yet</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create starter, scale, and enterprise plans with multi-currency pricing and squad deliverables.
              </p>
              <button
                onClick={openCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Create First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map((plan) => {
                return (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 relative ${
                      plan.is_featured
                        ? 'bg-gradient-to-b from-blue-950/40 to-[#0a0e1a] border-blue-500/40 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/30'
                        : 'bg-[#0a0e18] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Tag Badges */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {plan.badge && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {plan.badge}
                            </span>
                          )}
                          {plan.is_featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-300" /> Featured
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(plan)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                              plan.is_published
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-white/10'
                            }`}
                            title={plan.is_published ? 'Click to unpublish' : 'Click to publish'}
                          >
                            {plan.is_published ? '● Live' : '○ Draft'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">
                          {plan.name}
                        </h4>
                        {plan.tagline && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {plan.tagline}
                          </p>
                        )}
                      </div>

                      {/* Pricing Display */}
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-mono font-bold text-white">
                            {plan.price_usd || 'Custom Scope'}
                          </span>
                          <span className="text-[10px] font-mono uppercase text-slate-400">
                            {plan.billing_period || plan.pricing_model}
                          </span>
                        </div>

                        {(plan.price_eur || plan.price_gbp || plan.price_bdt) && (
                          <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-white/5 text-[10px] font-mono text-slate-400">
                            <div>EUR: <span className="text-slate-200">{plan.price_eur || '—'}</span></div>
                            <div>GBP: <span className="text-slate-200">{plan.price_gbp || '—'}</span></div>
                            <div>BDT: <span className="text-slate-200">{plan.price_bdt || '—'}</span></div>
                          </div>
                        )}
                      </div>

                      {/* Meta Delivery Specs */}
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {plan.timeline_estimate && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>Speed: <strong className="text-white">{plan.timeline_estimate}</strong></span>
                          </div>
                        )}
                        {plan.squad_composition && (
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">Squad: <strong className="text-white">{plan.squad_composition}</strong></span>
                          </div>
                        )}
                        {plan.sla_commitment && (
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">SLA: <strong className="text-white">{plan.sla_commitment}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Deliverables snippet */}
                      {Array.isArray(plan.features) && plan.features.length > 0 && (
                        <div className="pt-2 border-t border-white/5 space-y-1">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                            Deliverables ({plan.features.length})
                          </div>
                          <ul className="space-y-1">
                            {plan.features.slice(0, 3).map((f, i) => (
                              <li key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5 line-clamp-1">
                                <Check className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                            {plan.features.length > 3 && (
                              <li className="text-[10px] font-mono text-slate-500">
                                + {plan.features.length - 3} more deliverables
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="text-[10px] font-mono text-slate-500">
                        Order #{plan.display_order}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(plan)}
                          className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(plan)}
                          className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Create / Edit Plan */}
        {(isCreating || editingPlan) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl my-8 bg-[#0a0e18] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Commercial Plan'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Configure multi-currency pricing, deliverables, and delivery velocity.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPlan(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                    1. Plan Identity & Positioning
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Plan Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Core Launch / MVP"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Badge / Label
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g. Rapid Validation or Most Popular"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Tagline / Positioning Subcopy
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. High-velocity MVP execution for ambitious founders"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Best Suited For (Recommended Client Profile)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.recommended_for}
                      onChange={(e) => setFormData({ ...formData, recommended_for: e.target.value })}
                      placeholder="e.g. Early-stage founders validating market fit with production-grade stability"
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Section 2: Commercials & Multi-Currency */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    2. Commercial Structure & Multi-Currency
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Pricing Model
                      </label>
                      <select
                        value={formData.pricing_model}
                        onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="fixed">Fixed Scope Project</option>
                        <option value="milestone">Phased Milestone Tranches</option>
                        <option value="monthly">Monthly Engineering Retainer</option>
                        <option value="custom">Custom Scope / Contact Us</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Billing Period Note
                      </label>
                      <input
                        type="text"
                        value={formData.billing_period}
                        onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                        placeholder="e.g. per project, phased milestone, /month"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">USD ($)</label>
                      <input
                        type="text"
                        value={formData.price_usd}
                        onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                        placeholder="$15,000 – $35,000"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">EUR (€)</label>
                      <input
                        type="text"
                        value={formData.price_eur}
                        onChange={(e) => setFormData({ ...formData, price_eur: e.target.value })}
                        placeholder="€14,000 – €32,500"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">GBP (£)</label>
                      <input
                        type="text"
                        value={formData.price_gbp}
                        onChange={(e) => setFormData({ ...formData, price_gbp: e.target.value })}
                        placeholder="£11,700 – £27,300"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">BDT (৳)</label>
                      <input
                        type="text"
                        value={formData.price_bdt}
                        onChange={(e) => setFormData({ ...formData, price_bdt: e.target.value })}
                        placeholder="৳18,00,000 – ৳42,00,000"
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Squad & Delivery Velocity */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                    3. Squad Composition & SLA
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Timeline Estimate
                      </label>
                      <input
                        type="text"
                        value={formData.timeline_estimate}
                        onChange={(e) => setFormData({ ...formData, timeline_estimate: e.target.value })}
                        placeholder="e.g. 4 – 6 Weeks"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Squad Composition
                      </label>
                      <input
                        type="text"
                        value={formData.squad_composition}
                        onChange={(e) => setFormData({ ...formData, squad_composition: e.target.value })}
                        placeholder="e.g. 1 Architect + 2 Engineers"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        SLA Commitment
                      </label>
                      <input
                        type="text"
                        value={formData.sla_commitment}
                        onChange={(e) => setFormData({ ...formData, sla_commitment: e.target.value })}
                        placeholder="e.g. 99.9% Uptime Guarantee"
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Included Deliverables */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    4. Included Deliverables & Features
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                      placeholder="e.g. Multi-Tenant Database Isolation"
                      className="flex-1 px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono cursor-pointer shrink-0"
                    >
                      Add Deliverable
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {formData.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-xl text-xs text-slate-200 border border-white/5"
                      >
                        <span className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-400" />
                          <span>{feat}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Publication Settings */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    5. Publication & Order
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-5">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 bg-black/40 border-white/20 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="is_featured" className="text-xs font-bold text-white cursor-pointer">
                        Featured / Highlighted Card
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-5">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 bg-black/40 border-white/20 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="is_published" className="text-xs font-bold text-white cursor-pointer">
                        Publish This Plan
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingPlan(null);
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    {editingPlan ? 'Save Changes' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
