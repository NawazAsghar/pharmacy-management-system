// HOW: Imports the useContext hook from the React library.
// WHY: We need React's built-in tool to extract data from a Context broadcast channel.
// BTS: React loads the hook function into memory to query the virtual tree for matching context providers.
import { useContext } from "react";

// HOW: Imports the specific AuthContext object created in your context file.
// WHY: Tells useContext EXACTLY which broadcast channel we want to tune into.
// BTS: References the unique memory address created when createContext(null) was run.
import { AuthContext } from "../context/AuthContext";

// HOW: Defines and exports a custom React Hook named "useAuth".
// WHY: Gives us a reusable, bulletproof function to access auth data safely across any component.
// BTS: Encapsulates React context logic inside a standard function following the "use" naming convention.
export const useAuth = () => {

    // HOW: Asks React to look up the component tree for the nearest AuthContext provider.
    // WHY: Grabs the value object ({ user, login, logout... }) supplied by AuthProvider.
    // BTS: React walks up the Virtual DOM (Fiber tree) from this component searching for <AuthContext.Provider>.
    const context = useContext(AuthContext);

    // HOW: Checks if context is empty/falsy (null).
    // WHY: Catches developer mistakes early if someone forgets to wrap their app in <AuthProvider>.
    // BTS: If no <AuthContext.Provider> exists above this component in the tree, context defaults to null.
    if (!context) {
        // HOW: Instantly stops the app and prints a helpful error message in the console.
        // WHY: Tells the developer EXACTLY why their app crashed and how to fix it, preventing silent "cannot read property of null" bugs.
        // BTS: Interrupts React's rendering lifecycle and throws a JavaScript Exception.
        throw new Error('useAuth must be used within AuthProvider.');
    }

    // HOW: Returns the clean, validated context object.
    // WHY: Guarantees that whatever component called useAuth() receives valid auth state and functions.
    // BTS: Passes the memory reference of the context value straight to the calling variable.
    return context;
};