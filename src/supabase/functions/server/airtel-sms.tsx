/**
 * Airtel SMS Integration for OTP
 * 
 * This module handles sending OTP via Airtel SMS Gateway
 * Documentation: https://www.airtel.in/business/commercial-communication
 */

interface AirtelSMSConfig {
  apiKey: string;
  senderId: string;
  dltTemplateId: string;
}

interface AirtelSMSResponse {
  success: boolean;
  message?: string;
  error?: string;
  messageId?: string;
}

/**
 * Send OTP via Airtel SMS Gateway
 * @param mobile - 10-digit mobile number
 * @param otp - 6-digit OTP code
 * @returns Promise with SMS send result
 */
export async function sendOTPSMS(
  mobile: string,
  otp: string
): Promise<AirtelSMSResponse> {
  try {
    // Get Airtel credentials from environment variables
    const apiKey = Deno.env.get('AIRTEL_API_KEY');
    const senderId = Deno.env.get('AIRTEL_SENDER_ID');
    const dltTemplateId = Deno.env.get('AIRTEL_DLT_TEMPLATE_ID');
    const enableSMS = Deno.env.get('ENABLE_SMS_OTP') === 'true';
    const demoMode = Deno.env.get('DEMO_MODE') === 'true';

    // Demo mode - just log and return success
    if (demoMode || !enableSMS) {
      console.log(`[DEMO MODE] OTP for ${mobile}: ${otp}`);
      return {
        success: true,
        message: 'SMS sent (demo mode)',
        messageId: `demo_${Date.now()}`
      };
    }

    // Validate credentials
    if (!apiKey || !senderId || !dltTemplateId) {
      console.error('Airtel SMS credentials not configured');
      return {
        success: false,
        error: 'SMS service not configured. Please add AIRTEL_API_KEY, AIRTEL_SENDER_ID, and AIRTEL_DLT_TEMPLATE_ID to environment variables.'
      };
    }

    // Prepare SMS message
    const message = `Your Epicure Cafe OTP is ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;

    // Airtel SMS API endpoint
    const apiUrl = 'https://api.airtel.in/v1/sms/send';

    // Prepare request payload for Airtel
    const payload = {
      sender: senderId,
      message: message,
      mobile: `91${mobile}`, // Add country code for India
      dlt_template_id: dltTemplateId,
      unicode: false
    };

    console.log(`[Airtel SMS] Sending OTP to ${mobile}`);

    // Make API request to Airtel
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('[Airtel SMS] Error response:', responseData);
      return {
        success: false,
        error: responseData.message || 'Failed to send SMS'
      };
    }

    console.log('[Airtel SMS] SMS sent successfully:', responseData);

    return {
      success: true,
      message: 'OTP sent successfully',
      messageId: responseData.message_id || responseData.id
    };

  } catch (error) {
    console.error('[Airtel SMS] Exception while sending SMS:', error);
    return {
      success: false,
      error: 'Failed to send SMS. Please try again.'
    };
  }
}

/**
 * Alternative: Send OTP via Airtel DLT API (if using different endpoint)
 * Some Airtel services use different API endpoints based on region/plan
 */
export async function sendOTPViaDLT(
  mobile: string,
  otp: string
): Promise<AirtelSMSResponse> {
  try {
    const apiKey = Deno.env.get('AIRTEL_API_KEY');
    const senderId = Deno.env.get('AIRTEL_SENDER_ID');
    const dltTemplateId = Deno.env.get('AIRTEL_DLT_TEMPLATE_ID');

    if (!apiKey || !senderId || !dltTemplateId) {
      return {
        success: false,
        error: 'SMS credentials not configured'
      };
    }

    // Alternative Airtel DLT endpoint (adjust based on your Airtel plan)
    const apiUrl = 'https://dltconnect.airtel.in/sms/v1/send';

    const payload = {
      senderid: senderId,
      message: `Your Epicure Cafe OTP is ${otp}. Valid for 5 minutes. Do not share this code.`,
      number: mobile,
      templateid: dltTemplateId
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'OTP sent successfully',
        messageId: responseData.messageid
      };
    } else {
      return {
        success: false,
        error: responseData.message || 'Failed to send SMS'
      };
    }

  } catch (error) {
    console.error('[Airtel DLT] Error:', error);
    return {
      success: false,
      error: 'Failed to send SMS'
    };
  }
}

/**
 * Validate mobile number format
 */
export function validateMobileNumber(mobile: string): boolean {
  // Indian mobile numbers: 10 digits, starting with 6-9
  return /^[6-9]\d{9}$/.test(mobile);
}

/**
 * Format mobile number for API (add country code if needed)
 */
export function formatMobileNumber(mobile: string, addCountryCode: boolean = true): string {
  const cleaned = mobile.replace(/\D/g, '');
  
  if (addCountryCode && !cleaned.startsWith('91')) {
    return `91${cleaned}`;
  }
  
  return cleaned;
}
