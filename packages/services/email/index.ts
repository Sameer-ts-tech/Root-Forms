// Email service using Resend
// Set RESEND_API_KEY env variable to enable real email sending
// Falls back to console logging for development/demo

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export default class EmailService {
    private apiKey: string | undefined;
    private from: string = "Root-Forms <noreply@root-forms.sameerdev.tech>";

    constructor() {
        this.apiKey = process.env.RESEND_API_KEY;
    }

    private async sendViaResend(opts: EmailOptions): Promise<void> {
        if (!this.apiKey) {
            // Dev mode: log to console
            console.log("\n📧 [EMAIL STUB - set RESEND_API_KEY to send real emails]");
            console.log(`To: ${opts.to}`);
            console.log(`Subject: ${opts.subject}`);
            console.log("---");
            return;
        }

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: this.from,
                to: opts.to,
                subject: opts.subject,
                html: opts.html,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Email send error:", error);
            // Don't throw — email failure shouldn't break the flow
        }
    }

    public async sendCreatorNotification(opts: {
        creatorEmail: string;
        formTitle: string;
        formId: string;
        submissionCount: number;
    }): Promise<void> {
        await this.sendViaResend({
            to: opts.creatorEmail,
            subject: `New response on "${opts.formTitle}"`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0d1b12; color: #d8f3dc; border-radius: 12px;">
                    <h2 style="color: #52b788; margin-bottom: 16px;">🌿 New Form Response</h2>
                    <p>Someone just submitted a response to your form <strong>"${opts.formTitle}"</strong>.</p>
                    <p style="color: #95b8a0;">Total responses: ${opts.submissionCount}</p>
                    <a href="${process.env.WEB_URL || "http://localhost:3000"}/dashboard/forms/${opts.formId}/responses"
                       style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #52b788; color: #0d1b12; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        View Responses
                    </a>
                    <p style="margin-top: 32px; color: #95b8a0; font-size: 12px;">Root Forms · Unsubscribe</p>
                </div>
            `,
        });
    }

    public async sendRespondentConfirmation(opts: {
        respondentEmail: string;
        formTitle: string;
        submissionId: string;
    }): Promise<void> {
        await this.sendViaResend({
            to: opts.respondentEmail,
            subject: `Your response to "${opts.formTitle}" was received`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0d1b12; color: #d8f3dc; border-radius: 12px;">
                    <h2 style="color: #52b788; margin-bottom: 16px;">✅ Response Received</h2>
                    <p>Thank you for filling out <strong>"${opts.formTitle}"</strong>!</p>
                    <p style="color: #95b8a0;">Your submission ID: <code>${opts.submissionId}</code></p>
                    <p style="margin-top: 32px; color: #95b8a0; font-size: 12px;">Root Forms · Built with 🌿 nature themes</p>
                </div>
            `,
        });
    }
}
