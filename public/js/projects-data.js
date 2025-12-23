// Projects data - Easy to edit and manage your projects here
// You can add, remove, or modify projects in this array

const projectsData = [
    {
        title: "Wilder World",
        description: "A multiplayer meta-verse featuring racing, open-world exploration, and shooter mechanics.",
        image: "public/images/wilder-world-18lgh.jpg",  // Path to your project image
        video: null,  // Set to "public/videos/project1.mp4" if you have a video
        // Optional: Add a GitHub link if available (for open source code)
        // github: "https://github.com/yourusername/wilderworld",
        links: [
            {
                label: "Wilder World Website",
                url: "https://www.wilderworld.com"
            },
            {
                label: "Epic Games Store",
                url: "https://store.epicgames.com/en-US/p/wilder-world-wilder-world-alpha-b4ccf8"
            }
        ],
        details: `<p>Wilder World is an immersive decentralized metaverse built on Ethereum and Unreal Engine 5, offering a next-gen gaming experience. The game combines open-world exploration, competitive racing, and first-person shooter elements in a dynamic, ever-evolving environment.</p>

<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: #3a7bd5;">Features & Gameplay</h3>
<ul style="margin-left: 1.5rem; margin-bottom: 1rem; line-height: 1.8;">
    <li><strong>Wiami – A Futuristic Open World:</strong> A cyberpunk-style city inspired by Miami, where players can explore, interact, and engage in various activities.</li>
    <li><strong>High-Speed NFT-Based Racing:</strong> Players can own and race fully customizable NFT vehicles.</li>
    <li><strong>Decentralized & Community-Driven:</strong> Uses the $WILD token for governance, transactions, and rewards.</li>
    <li><strong>Multiplayer Combat & Shooter Mode:</strong> A seamless first-person shooter experience integrated within the metaverse.</li>
    <li><strong>Player-Owned Economy:</strong> Assets like cars, land, and avatars are represented as NFTs, allowing real ownership and trade.</li>
</ul>

<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: #3a7bd5;">Technology Used</h3>
<ul style="margin-left: 1.5rem; margin-bottom: 1rem; line-height: 1.8;">
    <li><strong>Unreal Engine 5:</strong> For high-quality, photorealistic graphics and immersive gameplay.</li>
    <li><strong>Ethereum & Polygon Blockchain:</strong> To enable NFT asset ownership and secure transactions.</li>
</ul>

<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: #3a7bd5;">My Contribution & Challenges</h3>
<p>In Wilder World, I played a key role in the backend integration of audio systems, ensuring that sound events and necessary parameters were dynamically sent to pre-existing audio assets. This resulted in a more immersive and realistic sound experience, especially for vehicle interactions.</p>
<p>My primary focus was on vehicle physics, particularly working with Chaos Vehicle Physics to create a realistic and responsive driving experience. To improve debugging efficiency, I developed custom debugging tools, making it easier to identify and resolve issues during development.</p>
<p>Another major area of my work involved destructible meshes, where I optimized a system that allowed tens of thousands of instanced static meshes to be fully destructible without compromising game performance. This was a significant challenge due to the potential computational load, but through efficient instancing and destruction logic, we achieved smooth performance.</p>
<p>Additionally, I contributed to the creation of elevators and worked across various aspects of the game, including animations, UI, and VFXs. While these were not my primary expertise, I successfully implemented necessary features whenever required, showcasing my versatility as a developer.</p>`
    },
    {
        title: "Mobile 3-Match Game",
        description: "A multiplayer 3-match puzzle game for Android mobile devices. Currently in development.",
        image: "public/images/work-in-progress.jpg",
        video: null,
        // github: "https://github.com/yourusername/project2",  // Add GitHub link when available
        details: `<p>A multiplayer 3-match puzzle game currently in development for Android mobile platforms. This project combines classic match-three gameplay mechanics with multiplayer functionality, allowing players to compete and interact in real-time.</p>

<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: #3a7bd5;">Project Status</h3>
<p><strong>Status:</strong> Work in Progress</p>
<p>This project is currently under active development. More details, features, and links will be added as development progresses.</p>

<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: #3a7bd5;">Planned Features</h3>
<ul style="margin-left: 1.5rem; margin-bottom: 1rem; line-height: 1.8;">
    <li><strong>Classic 3-Match Gameplay:</strong> Engaging puzzle mechanics where players match three or more items</li>
    <li><strong>Multiplayer Support:</strong> Real-time multiplayer functionality for competitive gameplay</li>
    <li><strong>Mobile-Optimized:</strong> Designed specifically for Android mobile devices with touch-friendly controls</li>
</ul>`
    }
    // Add more projects below by copying the structure above
];

