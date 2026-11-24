export type CloseRequestTarget = {
    /**
     * Whether a close request has anything to act on: an `onCloseRequest`
     * handler or a closed detent to snap to.
     */
    readonly handlesCloseRequests: boolean;
    handleCloseRequest(): void;
};
/**
 * Escape goes to the most recently opened sheet. One that reopens while
 * still closing is already registered, so it moves to the top.
 */
export declare const raiseCloseRequestRegistration: (target: CloseRequestTarget) => void;
export declare const setCloseRequestRegistration: (target: CloseRequestTarget, isRegistered: boolean) => void;
//# sourceMappingURL=closeRequest.d.ts.map