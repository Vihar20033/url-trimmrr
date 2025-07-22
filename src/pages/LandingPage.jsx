import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const faqs = [
  {
    question: 'How does the Trimmer URL Shortener work?',
    answer: 'Enter a long URL, and we generate a shorter version that redirects to the original.',
  },
  {
    question: 'Do I need an account?',
    answer: 'Yes, accounts help you manage URLs, view analytics, and personalize links.',
  },
  {
    question: 'What analytics do I get?',
    answer: 'Click count, geolocation, device info and more insights for your short links.',
  },
];

const Landing = () => {
  const [longUrl, setLongUrl] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (!longUrl) return alert('Please enter a URL');
    navigate(`/auth?createNew=${encodeURIComponent(longUrl)}`);
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center px-4">
      <h2 className="my-10 sm:my-16 text-4xl text-white text-center font-extrabold">
        Tired of Long, Messy URLs? Let’s Fix That...
        <br />
        <br />"The Shortener you need" 👇
      </h2>

      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
      >
        <Input
          type="url"
          value={longUrl}
          placeholder="Enter your loooooong URL"
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />
        <Button className="h-full" type="submit" variant="destructive">
          Shorten!
        </Button>
      </form>

      <img src="/Banner.jpg" alt="Banner" className="w-full my-11 md:px-11 rounded-xl shadow-lg" />

      <section className="w-full md:px-11 my-8 space-y-4">
        <h3 className="text-white text-2xl font-semibold mb-4 text-center">Frequently Asked Questions</h3>
        {faqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFAQ(index)}
            className={`cursor-pointer bg-white/10 border border-white/20 p-5 rounded-xl transition-all duration-300 ${
              openIndex === index ? 'bg-white/20 shadow-lg' : ''
            }`}
          >
            <div className="text-lg font-medium text-white flex justify-between items-center">
              {faq.question}
              <span className="text-xl">{openIndex === index ? '-' : '+'}</span>
            </div>
            {openIndex === index && (
              <p className="text-sm text-white mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Landing;
