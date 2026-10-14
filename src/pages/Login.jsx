import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Magic link: şifre yerine e-postaya tek kullanımlık giriş bağlantısı gönderilir.
  const [magicOpen, setMagicOpen] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicBusy, setMagicBusy] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  // Post-login destination (e.g. the MCP OAuth consent page sends users here
  // with returnTo so the grant flow can resume). Same-origin paths only.
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || "E-posta veya şifre hatalı");
    } finally {
      setLoading(false);
    }
  };

  const openMagic = () => {
    setMagicEmail(email);
    setMagicOpen(true);
  };

  const sendMagic = async () => {
    setMagicBusy(true);
    setError("");
    try {
      await base44.functions.invoke("magicLink", { action: "send", email: magicEmail.trim().toLowerCase() });
      setMagicSent(true);
    } catch (err) {
      setError(err?.response?.data?.error === "cok_fazla_istek"
        ? "Çok fazla istek gönderildi. Lütfen bir saat sonra tekrar deneyin."
        : err.message || "Giriş bağlantısı gönderilemedi");
    } finally {
      setMagicBusy(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Tekrar hoş geldiniz"
      subtitle="Dijitrak yönetim ve müşteri portalına giriş yapın"
      footer={
        <>
          Hesap yalnızca yönetici davetiyle açılır —{" "}
          <Link
            to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
            className="text-primary font-medium hover:underline"
          >
            davetle hesap açın
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="ornek@isletme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Giriş yapılıyor...
            </>
          ) : (
            "Giriş Yap"
          )}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-border text-center">
        {magicOpen ? (
          magicSent ? (
            <p className="text-sm text-primary font-medium">
              Giriş bağlantısı e-postanıza gönderildi — gelen kutunuzu kontrol edin.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                E-postanıza tek kullanımlık giriş bağlantısı gönderiyoruz; linke tıklamanız yeterli.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="ornek@isletme.com"
                  value={magicEmail}
                  onChange={(e) => setMagicEmail(e.target.value)}
                  className="h-11"
                />
                <Button type="button" onClick={sendMagic} disabled={magicBusy || !magicEmail.includes("@")} className="h-11 px-5">
                  {magicBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gönder"}
                </Button>
              </div>
            </div>
          )
        ) : (
          <button type="button" onClick={openMagic} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Şifrenizi mi unuttunuz? Tek kullanımlık giriş linki isteyin
          </button>
        )}
      </div>
    </AuthLayout>
  );
}