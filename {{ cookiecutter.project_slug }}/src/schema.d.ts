enum Roles {
    Admin = "admin",
    Superuser = "superuser",
    Client = "client",
    Staff = "staff",
    Proofer = "proofer",
    Manager = "manager",
    AccountManager = "accountManager",
}

enum DocStatus {
    Init = "init",
    ProcessingFiles = "processingFiles",
    AwaitingPayment = "awaitingPayment",
    Translating = "translating",
    Available = "available",
    Proofing = "proofing",
    Templating = "templating",
    Published = "published",
    Delivered = "delivered",
    Archived = "archived",
}

enum ContactMethods {
    Email = "email",
    PhoneNumber = "phoneNumber",
}

/**
 * Coupons are sent from one user to another that has never used the platform.
 */
export interface Coupons {
    [couponId: string]: {
        percentage: number;
        /**
         * TTL for document will always be set to this on creation
         */
        expiresAt: number;
        /**
         * UserId
         */
        fromId: string;
        /**
         * Name of the non-user the coupon is being shared with
         */
        toName: string;
        toEmail: string;
        toPhoneNumber: string;
        // Todo: Add other to___ methods
    };
}

/**
 * NB: Generate JSON schema programmatically, JIT, based on fields
 */
export interface Templates {
    [templateId: string]: {
        documentType: string; // Todo: convert to enum of document types
        /**
         * Whether to extract entities and do a second pass with those entities.
         * This would *not* make sense for small uniform types (licenses) but may
         * for larger documents in general.
         */
        entityPass: boolean;
        langauge: string; // Todo: convert to enum of language types
        country: string; // Todo: convert to enum of country types
        /**
         * Cloud storage refs of a examplar images for this schema
         */
        exemplarImages: string[];
        /**
         * Starting date of applicable dates for a document (e.g. a license type that only
         *  existed between x and y dates).
         */
        startDate: number;
        endDate: number;
        /**
         * If relevant for metadata on the template
         */
        issuer: string;
        municipality: string;
    };
}

export interface TemplateFields {
    [fieldId: string]: {
        name: string;
        type: "text" | "date" | "number" | "firstName" | "lastName" | "DOB";
        required: boolean;
        description: string;
        layout: {
            x: number;
            y: number;
            h: number;
            w: number;
        };
    };
}

/**
 * Documents > document > DocElements
 */
export interface DocElements {
    [docElementId: string]: {
        /**
         * Info from the template field backing this docElement.
         */
        field: {
            templateId: string;
            fieldId: string;
            fieldName: string;
        };
        transcription: string;
        translation: string;
        edits: {
            text: string;
            created: number;
            author: string;
            reason: "correction" | "clientRequest";
        }[];
        /**
         * For checkboxes next to translations
         */
        proofed: boolean;
        layout: {
            x: number;
            y: number;
            h: number;
            w: number;
        };
    };
}

export interface DocumentMeta {
    [documentMetaId: string]: {
        /**
         * One of the available LLM models
         */
        extractionModel: string; // Todo: convert to enum of available models.
        translationModel: string; // Todo: convert to enum of available models.
        totalTokens: number;
        imageProcessingTimeMs: number;
        extractionTimeMs: number;
        translationTimeMs: number;
        totalTime: number;
        totalLLMCost: number;
    };
}

export interface Documents {
    [documentId: string]: {
        /** uid of user */
        clientId: string;
        clientName: string;
        status: DocStatus;
        createdAt: number;
        updatedAt: number;
        proofed: boolean;
        proofedAt: number;
        /** UserId */
        proofer: string;
        /**
         * A document is marked as finalized after proofing and templating
         */
        finalizedAt: number;
        /**
         * Whether each individual field (a translation document) needs to be approved.
         * @default true
         */
        fieldLevelProofing: boolean;
        /**
         * After this date, if the document is finalized, it will be published
         * (can use function)
         */
        autoPublishDate: number;
        /**
         * publishing switches this flag and effectively publishes the document
         */
        draft: boolean;
        publishedAt: number;
        /**
         * "delivered" means the customer has received the job (e.g. by downloading it)
         */
        deliveredAt: number;
        archivedAt: number;
        invoiceItemId: string;
        documentMetaId: string;
        /**
         * A 1 to 5 rating given by the customer on this document.
         */
        rating: 1 | 2 | 3 | 4 | 5;
    };
}

/**
 * Todo: Consider removing this if not used.s
 */
export interface Events {
    [eventId: string]: {
        userId: string;
        documentId?: string;
        type: string; // Todo: narrow this down to specific types in an enum
        data: string;
        timestamp: number;
    };
}

/**
 * Documents > document > Files
 */
export interface Files {
    [fileId: string]: {
        uploadedBy: string;
        uploadedAt: number;
        fileName: string;
        type: string; // Todo: Convert to enum of allowed file types.
        /**
         * File reference
         */
        original: string;
        /**
         * File reference
         */
        enhanced: string;
    };
}

export interface Invoices {
    [invoiceId: string]: {
        userId: string;
        total: number;
        /**
         * Not related to a document just the receiptId from the payment processor
         */
        receiptId: string;
        paid: boolean;
        datePaid: number;
        dateReceived: number;
        paymentLink: string;
    };
}

/**
 * Invoices > invoice > InvoiceItems
 */
export interface InvoiceItems {
    [invoiceItemId: string]: {
        userId: string;
        documentId: string;
        baseAmount: number;
        multiplier: {
            id: string;
            name: string;
            factor: number;
        };
        valueAdds: {
            /**
             * value add id
             */
            id: string;
            name: string;
            cost: number;
        }[];
        tax: number;
        currency: "eur" | "usd" | "aud";
        receiptId: string;
        datePaid: number;
        /**
         * TODO: Make sure this is updated when document is delivered
         */
        dateDelivered: number;
        paymentLink: string;
    };
}

/**
 * Also to be used for notes on the job (could be labeled "notes" in the UI).
 * Can perma-link to a message as it will  open the document in details view and
 * scroll to it with it highlighted.
 *
 * Documents > document > Messages
 */
export interface Messages {
    [messageId: string]: {
        userId: string;
        text: string;
        /**
         * For public / private channel etc. Private = client can't view.
         */
        private: boolean;
        sentAt: number;
        deleted: boolean;
        deletedAt: number;
        /**
         * Array of userIds
         */
        readBy: string[];
    };
}

export interface Multipliers {
    [multiplierId: string]: {
        name: string;
        factor: number;
        description: string;
    };
}

export interface Notifications {
    [notificationId: string]: {
        topic: string; // Todo: convert to enum of available topics
        title: string;
        /**
         * Optional. Can be used to enhance notification.
         */
        body?: string;
        /**
         * Array of roles required to read notification
         */
        roles: Roles[];
        /**
         * userId to specifically allow a single user
         */
        user: string;
        sent: string;
    };
}

export interface SavedNotifications {
    [savedNotificationId: string]: {
        notificationId: string;
        /**
         * 0 = most urgent
         */
        urgency: 0 | 1 | 3;
        topic: string;
        title: string;
        body: string;
        /** datestamp */
        sent: string;
        /** datestamp */
        read: string;
    };
}

export interface Users {
    [uid: string]: {
        email: string;
        displayName: string;
        phoneNumber: string;
        /**
         * File reference
         */
        avatar: string; // Todo: Convert to template literal type to ensure correct formatting.
        roles: Roles[];
        /**
         * Notification topics User is subscribed to
         */
        subscribedTopics: string[]; // Todo: convert to array of enum values
        notificationMethods: ContactMethods[];
    };
}

export interface ValueAdds {
    [valueAddId: string]: {
        name: string;
        cost: number;
        description: string;
    };
}
