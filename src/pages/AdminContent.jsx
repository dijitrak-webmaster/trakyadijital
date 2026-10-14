import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  BookOpen, Images, Star, MessageSquare, Mail, Map, Store, Palette, Package, Megaphone, Tag,
} from 'lucide-react';
import BlogManager from '@/components/admin/BlogManager';
import PortfolioManager from '@/components/admin/PortfolioManager';
import TestimonialManager from '@/components/admin/TestimonialManager';
import CommentManager from '@/components/admin/CommentManager';
import NewsletterManager from '@/components/admin/NewsletterManager';
import DistrictScoreManager from '@/components/admin/DistrictScoreManager';
import MarketManager from '@/components/admin/MarketManager';
import ThemeManager from '@/components/admin/ThemeManager';
import BundleManager from '@/components/admin/BundleManager';
import CampaignManager from '@/components/admin/CampaignManager';
import DiscountCodeManager from '@/components/admin/DiscountCodeManager';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

// Kenar çubuğundaki alt bağlantılarla aynı anahtarlar; group = kenar çubuğu bölümü
export const CONTENT_TABS = [
  { key: 'blog', label: 'Blog', Manager: BlogManager, group: 'icerik', icon: BookOpen },
  { key: 'portfoy', label: 'Portföy', Manager: PortfolioManager, group: 'icerik', icon: Images },
  { key: 'yorumlar', label: 'Referanslar', Manager: TestimonialManager, group: 'icerik', icon: Star },
  { key: 'blog-yorumlari', label: 'Blog Yorumları', Manager: CommentManager, group: 'icerik', icon: MessageSquare },
  { key: 'bulten', label: 'Bülten', Manager: NewsletterManager, group: 'icerik', icon: Mail },
  { key: 'harita-skorlari', label: 'Harita Skorları', Manager: DistrictScoreManager, group: 'icerik', icon: Map },
  { key: 'market', label: 'Market', Manager: MarketManager, group: 'market', icon: Store },
  { key: 'temalar', label: 'Temalar', Manager: ThemeManager, group: 'market', icon: Palette },
  { key: 'bundle', label: 'Bundle Paketler', Manager: BundleManager, group: 'market', icon: Package },
  { key: 'kampanya', label: 'Kampanyalar', Manager: CampaignManager, group: 'market', icon: Megaphone },
  { key: 'indirim-kodu', label: 'İndirim Kodları', Manager: DiscountCodeManager, group: 'market', icon: Tag },
];

export default function AdminContent() {
  const { tab } = useParams();
  const entry = CONTENT_TABS.find((t) => t.key === tab);
  if (!entry) return <Navigate to="/admin/icerik/blog" replace />;
  const Manager = entry.Manager;

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 space-y-6 w-full">
      <AdminPageHeader crumb="Yönetim / İçerik" title={entry.label} />
      <Manager />
    </div>
  );
}