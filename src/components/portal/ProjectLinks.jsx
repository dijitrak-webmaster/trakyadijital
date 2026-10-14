import React from 'react';
import { Github, ExternalLink, FlaskConical } from 'lucide-react';

const LINKS = [
  { key: 'github_url', label: 'GitHub Deposu', icon: Github },
  { key: 'staging_url', label: 'Demo / Staging', icon: FlaskConical },
  { key: 'live_url', label: 'Canlı Site', icon: ExternalLink },
];

/** Portaldaki proje bağlantıları — GitHub, demo/staging ve canlı site */
export default function ProjectLinks({ project }) {
  const links = LINKS.filter((l) => project[l.key]);
  if (links.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2.5">
      {links.map(({ key, label, icon: Icon }) => (
        <a
          key={key}
          href={project[key]}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-xs font-semibold text-foreground/85 hover:border-mint/50 hover:text-mint transition-colors"
        >
          <Icon className="w-3.5 h-3.5" /> {label}
        </a>
      ))}
    </div>
  );
}