import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, Zap } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

// Kayıt sayfası davet modeliyle çalışır:
// • Magic link (?mtoken=): yöneticinin ürettiği tek kullanımlık bağlantı — hesap
//   şifresiz ve otomatik açılır, davetli yalnızca e-postasına gelen kodu girer.
// • Standart davet (?email=): davetli şifresini belirler, kodla doğrular.
const REDEEM_ERRORS = {
  link_gecersiz: "Bu bağlantı geçersiz. Yöneticinizden yeni bir bağlantı isteyin.",
  link_kullanildi: "Bu bağlantı daha önce kullanılmış. Giriş sayfasından e-postanıza yeni bir giriş linki gönderebilirsiniz.",
  link_suresi_gecmis: "Bu bağlantının süresi doldu. Giriş sayfasından e-postanıza yeni bir giriş linki gönderebilirsiniz.",
};

export default function Register() {
  const urlParams = new URLSearchParams(window.location.search);
  const mtoken = urlParams.get("mtoken");

  const [email, setEmail] = useState(
    () => urlParams.get("email") || ""
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [magicState, setMagicState] = useState(mtoken ? "working" : "idle");
  const [magicError, setMagicError] = useState("");
  const startedRef = useRef(false);

  const startMagic = async () => {
    setMagicState("working");
    setMagicError("");
    try {
      const res = await base44.functions.invoke("magicLink", { action: "redeem", token: mtoken });
      const { email: inviteEmail, password: autoPassword } = res.data;
      setEmail(inviteEmail);
      try {
        await base44.auth.register({ email: inviteEmail, password: autoPassword });
      } catch {
        // hesap daha önce açıldıysa üretilen şifreyle otomatik giriş denenir
        await base44.auth.loginViaEmailPassword(inviteEmail, autoPassword);
        window.location.href = safeReturnTo();
        return;
      }
      setShowOtp(true);
    } catch (err) {
      setMagicState("error");
      setMagicError(REDEEM_ERRORS[err?.response?.data?.error] || err?.message || "Bağlantı kullanılamadı");
    }
  };

  useEffect(() => {
    if (!mtoken || startedRef.current) return;
    startedRef.current = true;
    startMagic();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Kayıt başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "Doğrulama kodu geçersiz");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({
        title: "Kod gönderildi",
        description: "Yeni doğrulama kodu e-postanıza gönderildi.",
      });
    } catch (err) {
      setError(err.message || "Kod tekrar gönderilemedi");
    }
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="E-postanızı doğrulayın"
        subtitle={`${email} adresine kod gönderdik`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-medium"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Doğrulanıyor...
            </>
          ) : (
            "Doğrula ve Hesabı Aç"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Kod ulaşmadı mı?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">
            Tekrar gönder
          </button>
        </p>
      </AuthLayout>
    );
  }

  if (mtoken && magicState !== "idle") {
    return (
      <AuthLayout
        icon={magicState === "error" ? Mail : Zap}
        title={magicState === "error" ? "Bağlantı kullanılamadı" : "Hesabınız hazırlanıyor"}
        subtitle={
          magicState === "error"
            ? undefined
            : "Davetli hesabınız otomatik açılıyor — sizi doğrulama adımına alıyoruz."
        }
      >
        {magicState === "error" ? (
          <>
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {magicError}
            </div>
            <Button className="w-full h-12 font-medium" onClick={startMagic}>
              Tekrar Dene
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Hesabınız zaten açıksa{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                giriş yapın
              </Link>
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Birkaç saniye sürer...</p>
          </div>
        )}
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Hesabınızı açın"
      subtitle="Davet edilen e-postanızla şifrenizi belirleyin"
      footer={
        <>
          Hesabınız zaten varsa{" "}
          <Link
            to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")}
            className="text-primary font-medium hover:underline"
          >
            giriş yapın
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
          <p className="text-[11px] text-muted-foreground">
            Hesap yalnızca yöneticinin davet ettiği e-postalarla açılır.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Şifreyi Onayla</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Hesap oluşturuluyor...
            </>
          ) : (
            "Şifre Belirle ve Devam Et"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}