import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="bg-dark min-h-screen text-white">
            <Navbar />
            <HeroSection />

            {/* Desi Essence Section */}
            <div className="relative py-24 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-10 w-32 h-[1px] bg-gradient-to-r from-transparent to-gold opacity-50"></div>
                <div className="absolute top-1/2 right-10 w-32 h-[1px] bg-gradient-to-l from-transparent to-gold opacity-50"></div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <span className="text-saffron font-premium text-lg tracking-[0.2em] uppercase mb-4 block">Our Heritage</span>

                    <h2 className="text-4xl md:text-5xl font-premium font-bold text-white mb-8 leading-tight">
                        "Stories that touch the <span className="gradient-text italic">Soul</span>,<br />
                        Entertainment that feels like <span className="gradient-text italic">Home</span>."
                    </h2>

                    <div className="max-w-2xl mx-auto">
                        <p className="text-gray-400 font-body text-lg leading-relaxed">
                            Dive into a world where tradition meets luxury. Every frame is a painting, every story is a celebration of our vibrant culture.
                            Experience the magic of Desi storytelling in its most premium form.
                        </p>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-saffron rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
