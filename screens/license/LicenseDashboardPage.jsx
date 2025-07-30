"use client";

import { useState, useEffect } from "react";
import { urlBase } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth.context";
import {
  Copy,
  Loader2,
  LogOut,
  Trash2,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function LicenseDashboardPage({ config = {} }) {
  const {
    // Header component
    headerComponent: Header,
    
    // Content configuration
    content = {
      title: "License Information",
      description: "Manage your license",
      devicesSectionTitle: "Active Devices",
      devicesSectionDescription: "Manage your activated devices",
    },
    
    // Navigation paths
    navigation = {
      loginPath: "/license/login",
      pricingPath: "/pricing",
      homePath: "/",
    },
    
    // UI customization
    ui = {
      brandName: "Your App",
      showLogoutButton: true,
      showCancelSubscription: true,
      showDeviceManagement: true,
    },
    
    // API configuration
    api = {
      baseUrl: urlBase,
      endpoints: {
        licenseInfo: "/api/license/info",
        deactivateDevice: "/api/license/deactivate",
        cancelLicense: "/api/license/cancel",
      },
    },
    
    // Feature toggles
    features = {
      copyLicenseKey: true,
      deviceRemoval: true,
      subscriptionCancellation: true,
      subscriptionRenewal: true,
    },
    
    // Customization hooks
    onLicenseDataFetched = async (licenseData) => licenseData,
    onDeviceRemoved = async (deviceId, licenseData) => {},
    onSubscriptionCancelled = async (licenseData) => {},
    onLogout = async () => {},
    onError = async (error, context) => {},
    
    // Additional components
    additionalSections = [],
    
    // Styling
    className = "",
    
    // Logging
    logging = false,
  } = config;

  const { logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [licenseData, setLicenseData] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const isLicenseActive = licenseData?.status === "active";

  useEffect(() => {
    fetchLicenseData();
  }, []);

  const fetchLicenseData = async () => {
    try {
      if (logging) {
        console.log("🔄 [LICENSE_DASHBOARD] Fetching license data");
      }

      const response = await fetch(api.baseUrl + api.endpoints.licenseInfo, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        if (logging) {
          console.log("🔐 [LICENSE_DASHBOARD] Unauthorized, redirecting to login");
        }
        window.location.href = navigation.loginPath;
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch license data");
      }

      const processedData = {
        ...data.license,
        maxDevices: data.license.activationLimit,
        activeDevices: data.devices || [],
      };

      const finalData = await onLicenseDataFetched(processedData);
      setLicenseData(finalData);
      setError(null);

      if (logging) {
        console.log("✅ [LICENSE_DASHBOARD] License data fetched successfully");
      }
    } catch (err) {
      if (logging) {
        console.error("❌ [LICENSE_DASHBOARD] Error fetching license data:", err);
      }
      
      setError(err.message);
      await onError(err, "fetchLicenseData");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining until a date
  const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleCopyLicenseKey = () => {
    if (!features.copyLicenseKey) return;
    
    if (licenseData?.licenseKey) {
      navigator.clipboard.writeText(licenseData.licenseKey);
      toast({
        title: "License Key Copied",
        description: "The license key has been copied to your clipboard.",
      });
    }
  };

  const handleDeleteDevice = async () => {
    if (!selectedDevice || !features.deviceRemoval) return;
    setIsDeleting(true);

    try {
      if (logging) {
        console.log("🗑️ [LICENSE_DASHBOARD] Removing device:", selectedDevice);
      }

      const response = await fetch(api.baseUrl + api.endpoints.deactivateDevice, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          deviceId: selectedDevice,
          licenseKey: licenseData.licenseKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete device");
      }

      await onDeviceRemoved(selectedDevice, licenseData);

      toast({
        title: "Device Removed",
        description: "The device has been removed from your license.",
      });

      fetchLicenseData();

      if (logging) {
        console.log("✅ [LICENSE_DASHBOARD] Device removed successfully");
      }
    } catch (err) {
      if (logging) {
        console.error("❌ [LICENSE_DASHBOARD] Error removing device:", err);
      }
      
      await onError(err, "handleDeleteDevice");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedDevice(null);
      setIsDeleting(false);
    }
  };

  const handleCancelLicense = async () => {
    if (!features.subscriptionCancellation) return;
    setIsCancelling(true);

    try {
      if (logging) {
        console.log("❌ [LICENSE_DASHBOARD] Cancelling subscription");
      }

      const response = await fetch(api.baseUrl + api.endpoints.cancelLicense, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          licenseKey: licenseData.licenseKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to cancel license"
        );
      }

      await onSubscriptionCancelled(licenseData);

      toast({
        title: "Subscription Cancelled",
        description:
          data.message || "Your license has been cancelled successfully.",
        duration: 5000,
      });

      if (licenseData) {
        setLicenseData({
          ...licenseData,
          cancelled: true,
          cancelledAt: new Date(),
          ...(data.endDate && { nextBillingDate: new Date(data.endDate) }),
        });
      }

      fetchLicenseData();

      if (logging) {
        console.log("✅ [LICENSE_DASHBOARD] Subscription cancelled successfully");
      }
    } catch (err) {
      if (logging) {
        console.error("❌ [LICENSE_DASHBOARD] Error cancelling subscription:", err);
      }
      
      await onError(err, "handleCancelLicense");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
        duration: 5000,
      });
    } finally {
      setShowCancelDialog(false);
      setIsCancelling(false);
    }
  };

  const handleLogout = async () => {
    if (logging) {
      console.log("🚪 [LICENSE_DASHBOARD] Logout initiated");
    }
    
    try {
      await logout();
      await onLogout();
      
      window.location.href = navigation.homePath;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });

      if (logging) {
        console.log("✅ [LICENSE_DASHBOARD] Logout successful");
      }
    } catch (err) {
      if (logging) {
        console.error("❌ [LICENSE_DASHBOARD] Logout error:", err);
      }
      
      await onError(err, "handleLogout");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    }
  };

  if (error) {
    return (
      <div className={`min-h-screen bg-background ${className}`}>
        {Header && <Header />}
        <main className="px-4">
          <div className="max-w-6xl mx-auto py-8">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {Header && <Header />}
      <main className="px-4">
        <div className="contain mx-auto py-8 space-y-8">
          {/* License Info Card */}
          <Card>
            <div className="flex items-center justify-between pr-4">
              <div>
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                  <CardDescription>{content.description.replace('your license', `your ${ui.brandName} license`)}</CardDescription>
                </CardHeader>
              </div>
              <div className="flex items-center gap-2">
                {licenseData?.status && (
                  <Badge
                    className={`${
                      licenseData.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                        : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                    }`}
                    variant="secondary"
                  >
                    {licenseData.status.charAt(0).toUpperCase() +
                      licenseData.status.slice(1)}
                  </Badge>
                )}
                {licenseData?.cancelled && (
                  <Badge
                    className="bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                    variant="secondary"
                  >
                    Cancelled
                  </Badge>
                )}
                {licenseData?.licenseType && (
                  <Badge
                    className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                    variant="secondary"
                  >
                    {licenseData.licenseType.charAt(0).toUpperCase() +
                      licenseData.licenseType.slice(1)}
                  </Badge>
                )}
                {ui.showLogoutButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2 text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                )}
              </div>
            </div>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        License Key
                      </p>
                      <div className="flex group items-center gap-2 mt-1">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {licenseData?.licenseKey || "N/A"}
                        </code>
                        {licenseData?.licenseKey && features.copyLicenseKey && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyLicenseKey}
                            className="h-8 w-8 p-0 group-hover:text-red"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="mt-1">{licenseData?.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        License Type
                      </p>
                      <p className="mt-1 capitalize">
                        {licenseData?.licenseType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Device Limit
                      </p>
                      <p className="mt-1">
                        {licenseData
                          ? `${licenseData.activeDevices?.length || 0} / ${
                              licenseData.activationLimit || 0
                            } devices`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Subscription Status Section */}
                  {ui.showCancelSubscription && (licenseData?.licenseType === "monthly" ||
                  licenseData?.licenseType === "yearly") ? (
                    <div className="mt-4 pt-4 border-t">
                      {licenseData.cancelled || !isLicenseActive ? (
                        <div className="space-y-4">
                          <Alert
                            variant="warning"
                            className="bg-amber-50 flex items-center justify-between border-amber-200"
                          >
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <div>
                                <AlertTitle className="flex items-center text-amber-800">
                                  <span className="mr-2 h-2 w-2 rounded-full bg-amber-500"></span>
                                  Subscription Cancelled
                                </AlertTitle>
                                <AlertDescription className="text-amber-700">
                                  Your subscription was cancelled on{" "}
                                  {formatDate(licenseData.cancelledAt)}. You
                                  will have access until{" "}
                                  {formatDate(licenseData.nextBillingDate)}.
                                  After this date, your license will be revoked.
                                </AlertDescription>
                              </div>
                            </div>
                            {features.subscriptionRenewal && (
                              <Button
                                onClick={() => window.location.href = navigation.pricingPath}
                                variant="outline"
                                className="bg-accent text-white border-accent/35 hover:bg-accent/80 hover:text-white"
                                size="sm"
                                color="amber"
                              >
                                Get New License
                              </Button>
                            )}
                          </Alert>

                          {licenseData.nextBillingDate && (
                            <Card className="bg-slate-50 border-slate-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center">
                                  <CalendarClock className="h-4 w-4 mr-2 text-slate-600" />
                                  Access Details
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      End Date
                                    </p>
                                    <p className="font-medium">
                                      {formatDate(licenseData.nextBillingDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Days Remaining
                                    </p>
                                    <p className="font-medium">
                                      {getDaysRemaining(
                                        licenseData.nextBillingDate
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-0">
                                <p className="text-xs text-muted-foreground mt-2">
                                  You can continue using all features until this
                                  date. After this date, your license will be
                                  automatically revoked and you'll need to
                                  purchase a new license to continue using the
                                  app.
                                </p>
                              </CardFooter>
                            </Card>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                <span className="text-sm font-medium">
                                  Subscription Active
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Your next billing date is{" "}
                                {formatDate(licenseData.nextBillingDate)}.
                              </p>
                            </div>

                            {features.subscriptionCancellation && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowCancelDialog(true)}
                                className="w-auto self-start"
                              >
                                Cancel Subscription
                              </Button>
                            )}
                            <div className="text-sm text-muted-foreground space-y-2">
                              <p>
                                If you cancel, your subscription will remain
                                active until the end of your current billing
                                period.
                              </p>
                              <p className="text-xs">
                                After that date, your license will be
                                automatically revoked and you'll need to
                                purchase a new license.
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>

          {/* Devices Card */}
          {ui.showDeviceManagement && (
            <Card>
              <CardHeader>
                <CardTitle>{content.devicesSectionTitle}</CardTitle>
                <CardDescription>{content.devicesSectionDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : licenseData?.activeDevices?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {licenseData.activeDevices.map((device) => (
                        <TableRow key={device.deviceId}>
                          <TableCell className="font-medium">
                            {device.hostname || "Unknown Device"}
                          </TableCell>
                          <TableCell>
                            {device.lastUsedAt
                              ? new Date(device.lastUsedAt).toLocaleDateString()
                              : "Never"}
                          </TableCell>
                          <TableCell>
                            {features.deviceRemoval && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedDevice(device.deviceId);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No devices activated
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional sections */}
          {additionalSections.map((section, index) => (
            <div key={index}>{section}</div>
          ))}
        </div>

        {/* Delete Device Dialog */}
        {features.deviceRemoval && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Device</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this device? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isDeleting}
                  disabled={isDeleting}
                  variant="destructive"
                  onClick={handleDeleteDevice}
                >
                  {isDeleting ? "Removing..." : "Remove Device"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Cancel License Dialog */}
        {features.subscriptionCancellation && (
          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Subscription</DialogTitle>
                <DialogDescription className="pt-2">
                  Are you sure you want to cancel your subscription?
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Continue using {ui.brandName} until your billing period ends
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You'll have full access until{" "}
                      {formatDate(licenseData?.nextBillingDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Your subscription will not renew and license will be revoked
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You won't be charged again and your license will be
                      completely revoked after your current billing period
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <CalendarClock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      You can purchase a new license anytime
                    </p>
                    <p className="text-sm text-muted-foreground">
                      If you change your mind later, you'll need to create a new
                      license from the pricing page
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelLicense}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}