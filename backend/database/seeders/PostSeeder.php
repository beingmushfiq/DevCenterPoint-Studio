<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Seed the public engineering blog.
     *
     * Idempotent: every post is matched on its slug and updated in place, so the
     * deploy script can re-run this on an already-populated production database
     * to top up newly added articles without touching admin accounts.
     *
     * The topics are chosen around real search intent a Bangladesh-based custom
     * software buyer would type ("cost to build erp", "hire laravel developer in
     * bangladesh"), not around brand marketing copy.
     */
    public function run(): void
    {
        $posts = [
            [
                'slug' => 'custom-software-development-bangladesh-guide',
                'title' => 'Custom Software Development in Bangladesh: A Practical Buyer\'s Guide',
                'category' => 'Strategy',
                'author_name' => 'DevCenterPoint Team',
                'excerpt' => 'What a custom software engagement actually involves in Bangladesh - scoping, team structure, realistic timelines, and how to compare vendor quotes without getting misled.',
                'body' => "## Why companies choose custom software\n\nOff-the-shelf ERP, CRM and inventory products are built for the average business. If your operation has an unusual approval chain, a regional compliance rule, or a workflow that spans a warehouse and a storefront at the same time, the cost of adapting a packaged product usually exceeds the cost of building the part you actually need.\n\n## What a real engagement looks like\n\n1. **Discovery and scoping.** A written specification of the workflows, integrations and edge cases, agreed before development starts. If a vendor quotes a fixed price without one, the price is a guess.\n2. **Architecture.** The choice of stack is a business decision, not a fashion decision. It determines how expensive your system is to maintain three years from now.\n3. **Delivery in slices.** Working software every two to three weeks, reviewed against real data, rather than a single big reveal at the end.\n4. **Handover.** Source code, deployment documentation and database access belong to you. Test this at contract signature, not at project end.\n\n## How to compare quotes\n\nA quote of BDT 200,000 and a quote of BDT 1,200,000 are rarely describing the same thing. Ask each vendor the same four questions:\n\n- How many hours of testing are included?\n- Who owns the source code and the deployment pipeline?\n- What happens when a workflow changes six months after launch?\n- Which parts of the system are custom and which parts are licensed third-party services?\n\n## Choosing a partner\n\nThe strongest signal is not portfolio size, it is whether the team asks about your operations before talking about technology.\n",
                'cover_image_url' => 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=software%20engineering%20team%20reviewing%20an%20architecture%20diagram%20on%20a%20whiteboard%20in%20a%20modern%20Dhaka%20office%2C%20warm%20afternoon%20light%2C%20documentary%20photography%2C%20professional%20setting&image_size=landscape_16_9',
                'tags' => ['Custom Software', 'Bangladesh', 'Outsourcing'],
                'seo_title' => 'Custom Software Development in Bangladesh: A Buyer\'s Guide',
                'seo_description' => 'How custom software development in Bangladesh works in practice: scoping, architecture, timelines, ownership and how to compare vendor quotes fairly.',
                'published_at' => '2026-09-02 09:00:00',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'slug' => 'laravel-react-ssr-seo',
                'title' => 'Server-Side Rendering a Laravel + Inertia + React App for SEO',
                'category' => 'Engineering',
                'author_name' => 'DevCenterPoint Team',
                'excerpt' => 'Inertia ships a client-rendered shell by default, which leaves crawlers with an empty body. Here is how to add a runtime SSR server and make every page indexable.',
                'body' => "## The problem with a client-rendered SPA\n\nA default Inertia application returns HTML that contains a `<div id=\"app\">` and almost nothing else. The marketing copy, headings, meta tags and structured data all arrive later, executed by JavaScript in the browser. Search engines can often execute that JavaScript, but they do it on a budget - and AI crawlers frequently do not execute it at all.\n\nThe practical test is to disable JavaScript and load the page. If the body is empty, a meaningful share of your audience cannot read it.\n\n## How Inertia SSR works\n\nInertia's server-side rendering is a small Node process. Laravel posts the page object to `http://127.0.0.1:13714/render`, the Node process renders the React tree to an HTML string, and returns both the head elements and the body markup. Laravel echoes both into the response, so the first byte of HTML already contains the content.\n\n## The parts that matter\n\n- **A single self-contained bundle.** On shared hosting there is no production `node_modules`, so the SSR build must inline its dependencies and emit one `.mjs` file.\n- **A supervisor.** Shared cPanel hosting has no systemd, so the process is started at deploy time and kept alive by a cron job that probes a `/health` endpoint before restarting anything.\n- **A quiet failure mode.** When the SSR server is down, Inertia falls back to client rendering silently. There is no error for your users, but the SEO benefit disappears.\n\n## Verifying it worked\n\nView the page source, or curl the URL directly. You should see your heading, your meta description and your JSON-LD inside the initial response - before any script has executed.\n",
                'cover_image_url' => 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=server%20rack%20and%20code%20editor%20split%20view%20showing%20rendered%20HTML%20markup%2C%20dark%20themed%20developer%20workspace%2C%20blue%20accent%20glow%2C%20clean%20technical%20illustration&image_size=landscape_16_9',
                'tags' => ['Laravel', 'React', 'SEO', 'Inertia'],
                'seo_title' => 'Server-Side Rendering Laravel + Inertia + React for SEO',
                'seo_description' => 'A step-by-step look at adding runtime Inertia SSR to a Laravel and React app so search engines and AI crawlers receive fully rendered, indexable HTML.',
                'published_at' => '2026-09-16 09:00:00',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'slug' => 'erp-cost-bangladesh',
                'title' => 'What Does It Cost to Build a Custom ERP in Bangladesh?',
                'category' => 'Strategy',
                'author_name' => 'DevCenterPoint Team',
                'excerpt' => 'A breakdown of the cost drivers behind a custom ERP build - modules, integrations, data migration and support - and where budgets realistically land.',
                'body' => "## Cost is a function of scope, not of the word ERP\n\n\"ERP\" describes a category, not a specification. A single-warehouse inventory system and a multi-hub omnichannel platform with POS reconciliation are both called ERP, and they differ in cost by an order of magnitude.\n\n## The five cost drivers\n\n1. **Number of modules.** Accounting, inventory, purchasing, HR and sales each carry their own business rules. Every module has a data model, screens, permissions and reports.\n2. **Integrations.** Payment gateways, SMS providers, e-commerce storefronts and courier APIs each need their own failure handling. Third-party APIs are the most common source of hidden effort.\n3. **Data migration.** Moving years of inconsistent spreadsheet data into a normalised schema is real work, and it is frequently left out of quotes.\n4. **Concurrency requirements.** A system for twelve users behaves very differently from one for six hundred under peak load, and finishing that reliably costs engineering time.\n5. **Ongoing support.** The initial build is not the end of the relationship. Budget for maintenance, or plan to absorb the cost of a system that quietly rots.\n\n## Where budgets land\n\nA focused custom module set with one or two integrations is a small team's project over a few months. A full ERP replacing a legacy platform across multiple locations is a multi-quarter engagement with dedicated QA. Quotes that fall well below that band usually exclude testing, migration or handover.\n\n## Reducing cost without cutting quality\n\nPhase the build. Ship the workflows that carry the most daily pain first, prove the return, then fund the next phase. You get working software earlier and you avoid paying for modules you may never use.\n",
                'cover_image_url' => 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=financial%20dashboard%20with%20charts%20on%20a%20laptop%20screen%20on%20a%20wooden%20desk%2C%20notebook%20and%20coffee%20beside%20it%2C%20soft%20natural%20light%2C%20business%20planning%20concept&image_size=landscape_16_9',
                'tags' => ['ERP', 'Pricing', 'Bangladesh'],
                'seo_title' => 'Cost to Build a Custom ERP in Bangladesh',
                'seo_description' => 'The real cost drivers behind a custom ERP project in Bangladesh - modules, integrations, migration, concurrency and support - and how to phase a build to control budget.',
                'published_at' => '2026-09-24 09:00:00',
                'display_order' => 3,
                'is_published' => true,
            ],
            [
                'slug' => 'laravel-vs-nodejs-for-business-apps',
                'title' => 'Laravel vs Node.js for Business Applications: An Honest Comparison',
                'category' => 'Engineering',
                'author_name' => 'DevCenterPoint Team',
                'excerpt' => 'Both stacks ship production software every day. The right choice depends on your team, your workload shape and how long you need the codebase to survive.',
                'body' => "## There is no universal winner\n\nLaravel and Node.js are both mature, both performant, and both have large ecosystems. The useful question is which one fits *your* constraints: the people maintaining it, the shape of the workload, and the lifetime of the system.\n\n## Where Laravel wins\n\n- **Batteries included.** Authentication, queues, scheduling, ORM, migrations, caching and mail are first-party and documented. For CRUD-heavy business software this removes months of assembly.\n- **Onboarding.** A new PHP developer becomes productive in an existing Laravel codebase quickly, and the talent pool in the region is deep.\n- **Longevity.** Laravel's release discipline and upgrade guides make multi-year maintenance predictable.\n\n## Where Node.js wins\n\n- **Realtime at the edge.** WebSocket-heavy products, collaborative interfaces and streaming workloads are natural fits.\n- **One language across the stack.** If the team already writes TypeScript on the frontend, sharing types and validation between client and server removes a whole class of bugs.\n- **CPU-light, IO-heavy services.** A thin API gateway or a high-concurrency event consumer is cheap to run.\n\n## The decision rule\n\nIf the product is mostly business workflow - records, approvals, reports, integrations - Laravel gets you to a maintainable system faster. If the product is mostly realtime or streaming, or if the team is already unified on TypeScript, Node.js is the better default.\n\n## The hybrid answer\n\nMany of our systems are Laravel, with a Node process handling realtime or SSR work alongside it. Choosing one language for the whole product is a preference, not a requirement.\n",
                'cover_image_url' => 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=two%20code%20editor%20windows%20side%20by%20side%20on%20a%20large%20monitor%2C%20one%20showing%20PHP%20and%20one%20showing%20TypeScript%2C%20dark%20IDE%20theme%2C%20developer%20desk%20with%20mechanical%20keyboard&image_size=landscape_16_9',
                'tags' => ['Laravel', 'Node.js', 'Architecture'],
                'seo_title' => 'Laravel vs Node.js for Business Applications',
                'seo_description' => 'An honest comparison of Laravel and Node.js for business software: ecosystem, hiring, maintenance cost and where each stack genuinely performs better.',
                'published_at' => '2026-09-30 09:00:00',
                'display_order' => 4,
                'is_published' => true,
            ],
            [
                'slug' => 'erp-implementation-lessons',
                'title' => 'Five ERP Implementation Lessons From Real Deployments',
                'category' => 'Case Notes',
                'author_name' => 'DevCenterPoint Team',
                'excerpt' => 'Most ERP failures are organisational, not technical. These are the patterns we see repeatedly across warehouse, retail and service deployments.',
                'body' => "## 1. Model the operation, not the org chart\n\nSystems designed around who reports to whom age badly. Systems designed around what the business actually does - receive, allocate, fulfil, reconcile - survive reorganisations.\n\n## 2. Inventory accuracy is a data problem before it is a software problem\n\nNo platform fixes stock drift if physical counts and system records disagree at the start. We reconcile opening balances before go-live, not after.\n\n## 3. Every integration needs a failure plan\n\nA courier API will be down during peak season. A payment gateway will time out mid-transaction. Decide in advance whether the system retries, queues or fails loudly - and make sure staff know what to do.\n\n## 4. Reports are the product for most users\n\nWarehouse and finance staff may spend twenty minutes a day entering data and two hours reading reports. Report design deserves the same attention as data entry screens, and it is usually the first thing cut from a schedule.\n\n## 5. Train on the workflow, not the interface\n\nUsers who understand why a step exists adapt when the screen changes. Users who memorised a click sequence do not. Documentation should describe the process first.\n\n## The underlying theme\n\nCustom software succeeds when it is treated as an operational change with a software component, rather than a software delivery with a training day bolted on.\n",
                'cover_image_url' => 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=warehouse%20operations%20with%20workers%20using%20tablet%20scanners%20and%20barcode%20shelving%2C%20industrial%20lighting%2C%20wide%20documentary%20shot%2C%20organised%20inventory%20shelves&image_size=landscape_16_9',
                'tags' => ['ERP', 'Case Notes', 'Operations'],
                'seo_title' => 'Five ERP Implementation Lessons From Real Deployments',
                'seo_description' => 'The organisational patterns behind successful ERP rollouts - operational modelling, data reconciliation, integration failure planning, reporting and training.',
                'published_at' => '2026-10-05 09:00:00',
                'display_order' => 5,
                'is_published' => true,
            ],
        ];

        foreach ($posts as $post) {
            Post::updateOrCreate(['slug' => $post['slug']], $post);
        }
    }
}
