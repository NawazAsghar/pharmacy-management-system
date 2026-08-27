// HOW: Imports built-in tools directly from the React library.
// WHY: We need Context (to share data anywhere) and Hooks (to hold memory and run code on startup).
// BTS: React loads these utility functions into memory so this file can access React's inner engine.
import { createContext, useContext, useEffect, useState } from "react";

// HOW: Creates an invisible "broadcast station" (Context) starting with no data (null).
// WHY: Gives us a global container to store authentication data so we don't have to pass props through 10 components.
// BTS: React creates a unique memory node in its component tree reserved for this specific context.
const AuthContext = createContext(null);

// HOW: A wrapper component that receives all nested components as the "children" prop.
// WHY: Any component wrapped inside <AuthProvider>...</AuthProvider> gets access to auth data.
// BTS: React treats "children" as whatever JSX elements are placed between the opening and closing provider tags.
export const AuthProvider = ({ children }) => {

    // HOW: Creates "user" state starting as null (nobody logged in).
    // WHY: Keeps track of who is currently using the app.
    // BTS: React reserves a private memory cell for this component instance that survives re-renders.
    const [user, setUser] = useState(null);

    // HOW: Creates "loading" state starting as true.
    // WHY: Prevents the app from flashing "Login Page" for a split second while checking saved logins.
    // BTS: Keeps the app in a "waiting room" state while browser storage is checked.
    const [loading, setLoading] = useState(true);

    // HOW: Runs code inside the function ONCE when the app first loads (empty array [] means "run on start").
    // WHY: Automatically checks if the user logged in previously so they don't have to log in every time they refresh.
    // BTS: React puts this in a queue and executes it immediately after the initial screen paint.
    useEffect(() => {
        try {
            // HOW: Reads the saved access token from the browser's storage disk.
            // WHY: Checks if a security key was saved from a previous session.
            // BTS: Queries the browser's hard drive storage engine for the key 'access'.
            const access = localStorage.getItem('access');

            // HOW: If a token exists in storage, set a default user object in state.
            // WHY: Restores the logged-in session automatically.
            // BTS: Triggers React's state updater function, queuing a UI refresh.
            if (access) {
                setUser({ username: 'user' });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        // HOW: Sets loading to false after checking storage.
        // WHY: Tells the app "security check is complete, open the doors!".
        // BTS: Changes loading state, unlocking the conditional render at the bottom.
    }, []);

    // HOW: Function that runs when a user submits the login form.
    // WHY: Receives tokens from the server API, saves them, and updates the app state.
    // BTS: Bundles disk-writing operations and state changes into one reusable action.
    const login = (data) => {
        // HOW: Saves the access token and refresh token permanently in the browser.
        // WHY: Allows the user to stay logged in even if they close the browser tab.
        // BTS: Writes string key-value pairs to the browser domain's local storage database.
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        // HOW: Updates user state to show someone is logged in.
        // WHY: Triggers the UI to immediately update to "Logged In" mode.
        // BTS: Enqueues a state update; React re-renders all components subscribed to this Context.
        setUser({ username: 'user' });
    };

    // HOW: Function that runs when the user clicks the "Logout" button.
    // WHY: Clears credentials and resets the app state back to guest mode.
    // BTS: Deletes storage entries and resets state back to starting values.
    const logout = () => {
        // HOW: Deletes tokens from the browser storage disk.
        // WHY: Ensures the user's secret keys are destroyed on logout.
        // BTS: Erases the key-value pairs from the browser database.
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // HOW: Resets user state back to null.
        // WHY: Signals to every screen in the app that nobody is logged in now.
        // BTS: Re-renders subscribers with user set to null.
        setUser(null);
    };

    // HOW: Uses double-NOT (!!) to convert a truthy/falsy value into an explicit boolean (true/false).
    // WHY: Gives a simple true/false flag if a token exists in storage.
    // NOTE FOR TEACHING: It is better to use `!!user` here! Checking localStorage directly inside render doesn't automatically trigger re-renders when localStorage changes.
    // Reading localStorage directly inside a component's render body does not trigger React re-renders when the storage changes. Changing it to const isAuthenticated = !!user; ties authentication directly to React state, ensuring your UI immediately re-renders whenever a user logs in or out.
    const isAuthenticated = !!user; // (Better practice: derive from React state)

    // HOW: Groups all state items and helper functions into one neat package.
    // WHY: This is the payload bundle that gets sent out over our broadcast station.
    // BTS: Creates a JavaScript reference object to pass into the Context Provider.
    const value = { user, isAuthenticated, login, logout, loading };

    return (
        // HOW: Broadcasts the "value" package to all child components inside it.
        // WHY: Makes user data and login/logout functions available anywhere downstream.
        // BTS: React updates its internal Fiber tree node, notifying any component calling useAuth().
        <AuthContext.Provider value={value}>
            {/* HOW: Only displays children if loading is false. */}
            {/* WHY: Blocks private pages from rendering until the auth check is finished. */}
            {/* BTS: If loading is true, returns false (nothing renders). If false, evaluates to children. */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// HOW: Creates a custom hook so components can access AuthContext easily.
// WHY: Saves writing "useContext(AuthContext)" in every single file; now components just call "useAuth()".
// BTS: Wraps React's built-in useContext hook into a cleaner, exportable function name.
export const useAuth = () => useContext(AuthContext);