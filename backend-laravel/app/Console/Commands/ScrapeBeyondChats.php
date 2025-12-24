<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Article;
use DOMDocument;
use DOMXPath;

class ScrapeBeyondChats extends Command
{
    protected $signature = 'scrape:beyondchats';
    protected $description = 'Scrape 5 BeyondChats blog articles (final stable version)';

    public function handle()
    {
        $this->info('Starting fixed article scraping...');

        // ✅ Fixed real article URLs
       $links = [
            'https://beyondchats.com/blogs/which-ai-chatbot-is-right-for-your-business/',
            'https://beyondchats.com/blogs/what-if-ai-recommends-the-wrong-medicine-whos-to-blame-2/',
            'https://beyondchats.com/blogs/should-you-trust-ai-in-healthcare/',
            'https://beyondchats.com/blogs/ai-in-healthcare-hype-or-reality/',
            'https://beyondchats.com/blogs/choosing-the-right-ai-chatbot/',
        ];

        foreach ($links as $link) {

            if (Article::where('source_url', $link)->where('type', 'original')->exists()) {
                $this->warn("Skipping duplicate");
                continue;
            }

            $this->info("Scraping: $link");

            $html = @file_get_contents($link);
            if (!$html) {
                $this->error("Failed to fetch page");
                continue;
            }

            libxml_use_internal_errors(true);
            $dom = new DOMDocument();
            $dom->loadHTML($html);
            $xpath = new DOMXPath($dom);

            /* -------- TITLE -------- */
            $metaTitle = $xpath->query('//meta[@property="og:title"]/@content')->item(0);
            if ($metaTitle) {
                $title = trim($metaTitle->nodeValue);
            } else {
                $h1 = $xpath->query('//h1')->item(0);
                if (!$h1) {
                    $this->warn("Title not found, skipping");
                    continue;
                }
                $title = trim($h1->textContent);
            }

            /* -------- CONTENT -------- */

            // First try paragraphs
            $nodes = $xpath->query('//article//p');

            // Fallback to article divs
            if ($nodes->length === 0) {
                $nodes = $xpath->query('//article//div');
            }

            // Final fallback: any p tags
            if ($nodes->length === 0) {
                $nodes = $xpath->query('//p');
            }

            $content = '';
            foreach ($nodes as $node) {
                $text = trim($node->textContent);

                if (
                    strlen($text) > 80 &&
                    !str_contains($text, 'Privacy Policy') &&
                    !str_contains($text, 'Terms and Conditions') &&
                    !str_contains($text, 'Start your free trial')
                ) {
                    $content .= $text . "\n\n";
                }
            }

            // ✅ RELAXED minimum length
            if (strlen($content) < 300) {
                $this->warn("Content too short, skipping");
                continue;
            }

            /* -------- SAVE -------- */
            Article::create([
                'title' => $title,
                'content' => trim($content),
                'source_url' => $link,
                'type' => 'original',
            ]);

            $this->info("Saved: $title");
        }

        $this->info('✅ Fixed article scraping completed successfully');
    }
}
