export const config = {
    developer: {
        name: 'SniT',
        fullName: 'Nguyen Hoang Trung Tin',
        title: 'AI & Full-Stack Developer',
        description:
            'AI & Full-Stack Developer building intelligent systems and modern web applications. Passionate about machine learning, deep learning, and creating next-gen autonomous agents.',
    },
    social: {
        github: 'nguyentin082',
        email: 'nguyentin082@gmail.com',
        location: 'Vietnam',
    },
    about: {
        title: 'About Me',
        description:
            'I am an AI & Full-Stack Developer from Vietnam. I build intelligent systems, chatbots, and modern web applications. My expertise includes Machine Learning, Deep Learning, NLP, and Full-Stack Web Development with React, Node.js, and Python. Currently building next-gen AI Agents and Personal Assistants. I have a competitive programming mindset and a deep passion for automation. Code is poetry, AI is the canvas.',
    },
    experiences: [
        {
            position: 'AI Engineer & Full-Stack Developer',
            company: 'WATA Software Co., Ltd.',
            logo: '/images/watasoftware.png',
            period: '2025 - Present',
            location: 'Vietnam',
            description:
                'Working on cutting-edge AI and web development projects. Building intelligent systems, chatbots, and modern web applications.',
            responsibilities: [
                'Researching cutting-edge AI and ML technologies',
                'Experimenting with new frameworks and tools',
                'Contributing to open-source projects',
                'Building innovative personal projects',
            ],
            technologies: ['Research', 'Innovation', 'Open Source', 'New Tech'],
        },
        {
            position: 'Artificial Intelligence Software Engineer',
            company: 'Jumpstart Disruptive Innovations Pte. Ltd. (TechJDI)',
            logo: '/images/jdi.png',
            period: '2025',
            location: 'Vietnam',
            description:
                'Developed a comprehensive AI system for B2B clients, serving as both AI Engineer and Backend Developer. This involved extensive API integration, leveraging Natural Language Processing (NLP) for intelligent interactions and Computer Vision for advanced functionalities',
            responsibilities: [
                'Building AI-powered chatbots and conversational agents',
                'Developing machine learning models with TensorFlow and PyTorch',
                'Working with LLMs and transformer architectures',
                'Creating autonomous AI systems and automation tools',
            ],
            technologies: [
                'Python',
                'TensorFlow',
                'PyTorch',
                'LLMs',
                'NLP',
                'AI Agents',
            ],
        },
        {
            position: 'Software Engineer Intern',
            company:
                'Vietnam Posts and Telecommunications Group (VNPT) Ho Chi Minh City - IT Center',
            logo: '/images/vnpt.png',
            period: '2024',
            location: 'Vietnam',
            description:
                'Developed and maintained front-end applications using Angular.js and Flutter. Collaborated with the backend team to integrate APIs, ensuring seamless data flow. Optimized UI/UX for better user experience and performance',
            responsibilities: [
                'Developing and maintaining front-end applications',
                'Collaborating with the backend team to integrate APIs',
                'Optimizing UI/UX for better user experience and performance',
                'Testing and debugging front-end applications',
                'Documenting and maintaining codebase',
            ],
            technologies: [
                'Angular.js',
                'Flutter',
                'TypeScript',
                'HTML/CSS',
                'JavaScript',
                'API Integration',
            ],
        },
    ],
    projects: [
        {
            id: 1,
            title: 'AMAZ Healthcare AI Agent',
            category: 'AI Agent / LLM / RAG',
            technologies:
                'Python, FastAPI, LangGraph, LangChain, Milvus, MongoDB, Redis, Langfuse, Prometheus, Docker',
            image: '/images/amaz-agent.png',
            description:
                'Production-ready healthcare AI agent platform using a LangGraph supervisor–sub-agent architecture (drug, hospital, info, user-profile agents) with RAG over Milvus. Supports runtime switching between OpenAI, Gemini, Ollama and HuggingFace, Chain/Tree-of-Thought reasoning, Redis-queued distributed document ingestion with Vietnamese NER, safety guardrails (PII, self-harm, injection), and a Langfuse-based evaluation framework.',
            link: 'https://huggingface.co/red1-for-hek/drishti-ilm-x1',
        },
        {
            id: 2,
            title: 'Camera AI Inference Platform',
            category: 'Computer Vision',
            technologies:
                'Python, PyTorch, ONNX, TensorRT, Triton, DeepStream, FastAPI, Kafka, Qdrant, Redis, DVC',
            image: '/images/camera-ai.png',
            description:
                'Real-time AI inference platform for a Video Management System covering license plate recognition (ANPR), face recognition with anti-spoofing, and behavior detection. One codebase auto-selects its runtime: TensorRT + Triton on NVIDIA, PyTorch MPS on Apple Silicon, ONNX on CPU. Uses RT-DETR, PP-OCR, SCRFD and ByteTrack, with a sub-5ms Redis/Qdrant fast path for alerts, a Kafka audit pipeline, and a full train → eval → export → model registry workflow.',
            link: 'https://github.com/red1-for-hek/smart-election-by-blockchain',
        },
        {
            id: 3,
            title: 'Server Monitoring Stack',
            category: 'DevOps / Observability',
            technologies:
                'Docker Compose, Prometheus, Grafana, Loki, Promtail, Node Exporter, cAdvisor, Dozzle',
            image: '/images/server-monitoring.png',
            description:
                'Full observability stack deployed with one Docker Compose command: host and container metrics (Node Exporter, cAdvisor → Prometheus), centralized logs from Docker containers, /var/log and the systemd journal (Promtail → Loki), and auto-provisioned Grafana dashboards. A lightweight agent compose file onboards remote servers for multi-server monitoring.',
            link: '',
        },
    ],
    contact: {
        email: 'nguyentin082@gmail.com',
        github: 'https://github.com/nguyentin082',
        linkedin: 'https://linkedin.com/in/nguyentin082',
        twitter: 'https://x.com/nguyentin082',
        facebook: 'https://www.facebook.com/trungtin.h.nguyen.908',
        instagram: 'https://www.instagram.com/trungtin.h.nguyen.908',
    },
    skills: {
        develop: {
            title: 'AI DEVELOPER',
            description: 'Building intelligent systems & AI solutions',
            details:
                'Developing AI agents, chatbots, and machine learning & deep learning models using Python, TensorFlow, and PyTorch. Specializing in LLMs, NLP, deep learning, and autonomous systems.',
            tools: [
                'Python',
                'TensorFlow',
                'PyTorch',
                'OpenCV',
                'Scikit-learn',
                'LLMs',
                'NLP',
                'Deep Learning',
                'Chatbots',
                'AI Agents',
            ],
        },
        design: {
            title: 'FULL-STACK',
            description: 'Modern web development & scalable applications',
            details:
                'Building responsive and performant web applications using React, Next.js, Node.js, and databases. Creating seamless user experiences with modern UI/UX principles.',
            tools: [
                'React',
                'Next.js',
                'Node.js',
                'TypeScript',
                'MongoDB',
                'PostgreSQL',
                'TailwindCSS',
                'REST APIs',
                'Docker',
                'Git',
            ],
        },
    },
};
