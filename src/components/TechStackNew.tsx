import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/TechStackNew.css';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
    name: string;
    icon: string;
    url: string;
}

interface TechGroup {
    title: string;
    items: TechItem[];
}

// Tech stack grouped by domain, each item with its icon and official URL
const techGroups: TechGroup[] = [
    {
        title: 'Languages',
        items: [
            {
                name: 'Python',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
                url: 'https://python.org',
            },
            {
                name: 'JavaScript',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
            },
            {
                name: 'TypeScript',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
                url: 'https://typescriptlang.org',
            },
            {
                name: 'C',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
                url: 'https://en.cppreference.com/w/c',
            },
            {
                name: 'C++',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
                url: 'https://isocpp.org',
            },
            {
                name: 'HTML',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
            },
            {
                name: 'CSS',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
                url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
            },
            {
                name: 'Bash',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
                url: 'https://www.gnu.org/software/bash/',
            },
        ],
    },
    {
        title: 'Frontend',
        items: [
            {
                name: 'React',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
                url: 'https://react.dev',
            },
            {
                name: 'Next.js',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
                url: 'https://nextjs.org',
            },
            {
                name: 'Tailwind',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
                url: 'https://tailwindcss.com',
            },
            {
                name: 'Bootstrap',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
                url: 'https://getbootstrap.com',
            },
        ],
    },
    {
        title: 'Backend',
        items: [
            {
                name: 'Node.js',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
                url: 'https://nodejs.org',
            },
            {
                name: 'NestJS',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
                url: 'https://nestjs.com',
            },
            {
                name: 'Django',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
                url: 'https://djangoproject.com',
            },
            {
                name: 'Flask',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
                url: 'https://flask.palletsprojects.com',
            },
            {
                name: 'FastAPI',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
                url: 'https://fastapi.tiangolo.com',
            },
        ],
    },
    {
        title: 'AI / ML',
        items: [
            {
                name: 'PyTorch',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
                url: 'https://pytorch.org',
            },
            {
                name: 'TensorFlow',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
                url: 'https://tensorflow.org',
            },
            {
                name: 'Scikit-learn',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
                url: 'https://scikit-learn.org',
            },
            {
                name: 'OpenCV',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg',
                url: 'https://opencv.org',
            },
            {
                name: 'Hugging Face',
                icon: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
                url: 'https://huggingface.co',
            },
            {
                name: 'LangChain',
                icon: 'https://cdn.simpleicons.org/langchain/white',
                url: 'https://langchain.com',
            },
            {
                name: 'NumPy',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
                url: 'https://numpy.org',
            },
            {
                name: 'Pandas',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
                url: 'https://pandas.pydata.org',
            },
            {
                name: 'Jupyter',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
                url: 'https://jupyter.org',
            },
        ],
    },
    {
        title: 'Database',
        items: [
            {
                name: 'PostgreSQL',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
                url: 'https://postgresql.org',
            },
            {
                name: 'MySQL',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
                url: 'https://mysql.com',
            },
            {
                name: 'MongoDB',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
                url: 'https://mongodb.com',
            },
            {
                name: 'Redis',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
                url: 'https://redis.io',
            },
            {
                name: 'Firebase',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
                url: 'https://firebase.google.com',
            },
        ],
    },
    {
        title: 'DevOps & Cloud',
        items: [
            {
                name: 'Docker',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
                url: 'https://docker.com',
            },
            {
                name: 'AWS',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
                url: 'https://aws.amazon.com',
            },
            {
                name: 'Azure',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
                url: 'https://azure.microsoft.com',
            },
            {
                name: 'Vercel',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
                url: 'https://vercel.com',
            },
            {
                name: 'NGINX',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
                url: 'https://nginx.org',
            },
            {
                name: 'Linux',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
                url: 'https://linux.org',
            },
        ],
    },
    {
        title: 'Tools',
        items: [
            {
                name: 'Git',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
                url: 'https://git-scm.com',
            },
            {
                name: 'GitHub',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
                url: 'https://github.com',
            },
            {
                name: 'VS Code',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
                url: 'https://code.visualstudio.com',
            },
            {
                name: 'Postman',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
                url: 'https://postman.com',
            },
            {
                name: 'Figma',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
                url: 'https://figma.com',
            },
        ],
    },
];

const TechStackNew = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils
                .toArray<HTMLElement>('.techstack-group')
                .forEach((group) => {
                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: group,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    });

                    // Fade in group label, then stagger items up
                    timeline.fromTo(
                        group.querySelector('.techstack-group-title'),
                        { opacity: 0, x: -30 },
                        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
                    );

                    timeline.fromTo(
                        group.querySelectorAll('.techstack-item'),
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.06,
                            ease: 'power3.out',
                            // Hand transform back to CSS so hover still works
                            clearProps: 'transform',
                        },
                        '-=0.4',
                    );
                });
        }, sectionRef);

        // Clean up
        return () => ctx.revert();
    }, []);

    return (
        <div className="techstack-new" ref={sectionRef}>
            {/* Content */}
            <div className="techstack-content">
                <h2>Tech Stack</h2>

                <div className="techstack-groups">
                    {techGroups.map((group) => (
                        <div key={group.title} className="techstack-group">
                            <h3 className="techstack-group-title">
                                {group.title}
                            </h3>
                            <div className="techstack-group-items">
                                {group.items.map((tech, techIndex) => (
                                    <a
                                        key={tech.name}
                                        href={tech.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="techstack-item"
                                        title={tech.name}
                                        data-cursor="disable"
                                        style={
                                            {
                                                '--float-delay': `${-(techIndex % 5) * 0.8}s`,
                                            } as React.CSSProperties
                                        }
                                    >
                                        <img
                                            src={tech.icon}
                                            alt={tech.name}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <span>{tech.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TechStackNew;
