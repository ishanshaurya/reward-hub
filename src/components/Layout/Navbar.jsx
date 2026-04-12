import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
    const { user, signOut } = useAuth()

    return (
        <nav
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'var(--border-default)', background: 'var(--bg-secondary)' }}
        >
            <div className="flex items-center gap-2">
                <span style={{ color: 'var(--accent-primary)', fontSize: 22 }}></span>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>RewardHub</span>
            </div>
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {user.user_metadata?.full_name || user.email}
                    </span>
                    <button
                        onClick={signOut}
                        className="text-sm px-4 py-2 rounded-lg border transition-colors"
                        style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                    >
                        Sign out
                    </button>
                </div>
            )}
        </nav>
    )
}