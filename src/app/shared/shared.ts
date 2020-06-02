import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from "@angular/animations";

export enum TEXT_STATUS {
    sent = "Sent",
    notSeen = "Not Seen",
    read = "Read",
    unread = "UnRead",
    received = "Received",
    notReceived = "Not Received"
}

export const leftLoadTrigger: AnimationTriggerMetadata =
    trigger( "slideLeft", [
        state( "in", style( { transform: "translateX(0)" } ) ),
        transition( "void => *", [
            style( { transform: "translateX(-20px)" } ),
            animate( 100 )
        ] )
    ] );

export const opacityTrigger: AnimationTriggerMetadata =
    trigger( "opacityUp", [
        state( "in", style( { opacity: 1 } ) ),
        transition( "void => *", [
            style( { opacity: 0 } ),
            animate( 200 )
        ] )
    ] );
