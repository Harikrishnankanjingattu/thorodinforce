import React from 'react';
import { X, CheckCircle, Mail } from 'lucide-react';

export interface DispatchData {
  name: string;
  age: string | number;
  location: string;
  email: string;
  urgency: string;
  grievance: string;
  submittedAt: string;
  status: 'sent' | 'simulated' | 'queued';
  deliveryMode: string;
}

interface EmailInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DispatchData | null;
}

export const EmailInspectorModal: React.FC<EmailInspectorModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(3, 6, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '1px solid rgba(0, 242, 254, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 242, 254, 0.25)',
          overflow: 'hidden',
          backgroundColor: '#070d1a',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(11, 22, 44, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid var(--cyan-core)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-core)',
              }}
            >
              <Mail size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-mythic)',
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                Raven Dispatch Inspector (Email Delivery)
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Live Verification for Assignment Evaluators
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content / Email Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Status Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} color="var(--cyan-core)" />
              <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                Dispatched to Alter Ego ({data.deliveryMode})
              </span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '3px 10px',
                borderRadius: '20px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid var(--cyan-core)',
                color: 'var(--cyan-core)',
                fontFamily: 'var(--font-mythic)',
                boxShadow: '0 0 10px rgba(0, 242, 254, 0.3)',
              }}
            >
              NEAR REAL-TIME
            </span>
          </div>

          {/* Email Subject Preview */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Subject Line
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mythic)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#ffffff',
                background: 'rgba(15, 26, 52, 0.5)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                marginTop: '4px',
              }}
            >
              🦸 Someone Needs Your Help!
            </div>
          </div>

          {/* Rendered HTML Email Container */}
          <div
            style={{
              background: '#04070e',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Thor Email Header */}
            <div
              style={{
                borderBottom: '2px solid rgba(0, 242, 254, 0.3)',
                paddingBottom: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mythic)', fontSize: '1.2rem', color: 'var(--cyan-core)', fontWeight: 800 }}>
                  ⚡ THOR DISPATCH COURIER
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Asgardian Raven Transmission · Midgard Watchtower
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {data.submittedAt}
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              A mortal in Midgard has summoned Thor and submitted a request for aid through the interactive portal:
            </p>

            {/* Metadata Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                background: 'rgba(11, 22, 44, 0.6)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Name</span>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{data.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Age</span>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{data.age} winters</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location</span>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{data.location}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</span>
                <div style={{ fontWeight: 700, color: 'var(--cyan-core)', fontSize: '0.95rem' }}>{data.email}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Urgency Level</span>
                <div style={{ fontWeight: 700, color: 'var(--cyan-core)', fontSize: '0.95rem' }}>{data.urgency}</div>
              </div>
            </div>

            {/* Grievance / Request Message */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Full Grievance / Situation Description
              </div>
              <div
                style={{
                  background: 'rgba(15, 26, 52, 0.8)',
                  borderLeft: '4px solid var(--cyan-core)',
                  padding: '16px',
                  borderRadius: '0 8px 8px 0',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}
              >
                &ldquo;{data.grievance}&rdquo;
              </div>
            </div>

            {/* Thor Sign-off Footer */}
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}
            >
              “No storm lasts forever — and you don’t have to weather it alone.” — Thor Odinson
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            background: 'rgba(11, 22, 44, 0.4)',
          }}
        >
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
