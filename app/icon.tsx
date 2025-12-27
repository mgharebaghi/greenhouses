
import { ImageResponse } from 'next/og'
import { join } from 'path'
import { readFileSync } from 'fs'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

export const runtime = 'nodejs'

// Image generation
export default function Icon() {
    const logoPath = join(process.cwd(), 'public/Images/Logo.png')
    const logoData = readFileSync(logoPath)
    // Convert buffer to base64 for img src
    const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img
                    src={logoSrc}
                    alt="Icon"
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: 'scale(1.6)', // Zoom in to remove whitespace
                        objectFit: 'contain'
                    }}
                />
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
