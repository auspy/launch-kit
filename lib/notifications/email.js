import { loops } from "@/lib/loops.config";
import { supportEmail } from "@/constants";

const TEMPLATES = {
  LICENSE_CREATED: process.env.LOOPS_LICENSE_CREATED_TEMPLATE_ID,
  DEVICE_ACTIVATED: process.env.LOOPS_DEVICE_ACTIVATED_TEMPLATE_ID,
  DEVICE_DEACTIVATED: process.env.LOOPS_DEVICE_DEACTIVATED_TEMPLATE_ID,
  LICENSE_ISSUE: process.env.LOOPS_LICENSE_ISSUE_TEMPLATE_ID,
};

// Send license creation confirmation
export async function sendLicenseCreatedEmail(
  email,
  licenseKey,
  throwError = false,
  licenseType = null
) {
  try {
    const templateId = TEMPLATES.LICENSE_CREATED;
    if (!templateId) {
      throw new Error("❌ LOOPS_LICENSE_CREATED_TEMPLATE_ID is not set");
    }
    if (!email) {
      throw new Error("❌ Email is not set");
    }
    if (!licenseKey) {
      throw new Error("❌ License key is not set");
    }
    const dataVariables = {
      licenseKey,
      downloadUrl: process.env.DOWNLOAD_URL || "",
      supportEmail: supportEmail || "",
    };
    console.log(
      "💾 Sending license created email to",
      email,
      "with template",
      templateId,
      dataVariables
    );
    // update the contact with the source
    if (licenseType) {
      try {
        const updateDataVariables = {
          source: "license-created",
          userGroup: licenseType,
        };
        const contact = await loops.updateContact(email, updateDataVariables);
        console.log("💾 Contact updated successfully", contact);
      } catch (error) {
        console.error("Failed to update contact with source:", error);
      }
    }
    const response = await loops.sendTransactionalEmail({
      transactionalId: templateId,
      email,
      dataVariables,
      addToAudience: true,
    });
    console.log("💾 License created email sent successfully", response);
    return response.success;
  } catch (error) {
    console.error("Failed to send license creation email:", error);
    if (throwError) {
      throw error;
    }
    return false;
  }
}

// Send device activation confirmation
export async function sendDeviceActivationEmail(email, licenseKey, deviceName) {
  const dataVariables = {
    licenseKey,
    deviceName,
    activationDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    supportEmail: supportEmail,
  };
  const templateId = TEMPLATES.DEVICE_ACTIVATED;
  try {
    const response = await loops.sendTransactionalEmail({
      transactionalId: templateId,
      email: email,
      dataVariables,
    });
    return response.success;
  } catch (error) {
    console.error(
      "Failed to send device activation email:",
      error,
      dataVariables,
      templateId
    );
    return false;
  }
}

// Send device deactivation confirmation
export async function sendDeviceDeactivationEmail(
  email,
  licenseKey,
  deviceInfo
) {
  try {
    const response = await loops.sendTransactionalEmail({
      transactionalId: TEMPLATES.DEVICE_DEACTIVATED,
      email,
      dataVariables: {
        licenseKey,
        deviceName: deviceInfo.name,
        deactivationDate: new Date().toISOString(),
        supportEmail: supportEmail,
      },
    });
    return response.success;
  } catch (error) {
    console.error("Failed to send device deactivation email:", error);
    return false;
  }
}

// Send critical license issues (like repeated validation failures)
export async function sendLicenseIssueEmail(email, licenseKey, issueDetails) {
  try {
    const response = await loops.sendTransactionalEmail({
      transactionalId: TEMPLATES.LICENSE_ISSUE,
      email,
      dataVariables: {
        licenseKey,
        issueType: issueDetails.type,
        issueMessage: issueDetails.message,
        nextSteps: issueDetails.nextSteps,
      },
    });
    return response.success;
  } catch (error) {
    console.error("Failed to send license issue email:", error);
    return false;
  }
}

/**
 * Send an email to notify the user about subscription cancellation
 * @param {string} email - Recipient email
 * @param {string} licenseKey - The license key
 * @param {string} licenseType - Type of license (monthly, yearly)
 * @param {Date} endDate - When the subscription will end
 */
export async function sendSubscriptionCancelledEmail(
  email,
  licenseKey,
  licenseType,
  endDate
) {
  try {
    if (!email) {
      console.error(
        "Email is required for subscription cancellation notification"
      );
      return;
    }

    // Format the end date for display
    const formattedEndDate = endDate
      ? new Date(endDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "the end of your current billing period";

    // Determine subscription frequency for user-friendly messaging
    const subscriptionPeriod = licenseType === "yearly" ? "annual" : "monthly";

    await loops.sendTransactional({
      transactionalId: "subscription-cancelled",
      to: email,
      dataVariables: {
        license_key: licenseKey,
        subscription_type: subscriptionPeriod,
        end_date: formattedEndDate,
      },
    });

    console.log(
      `Subscription cancellation email sent to ${email} for license ${licenseKey}`
    );
  } catch (error) {
    console.error("Error sending subscription cancellation email:", error);
  }
}
