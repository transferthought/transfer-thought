<template>
    <div
        id="home"
        class="pa-4"
    >
        <v-container fluid>
            <h3 class="headline font-weight-medium">
                Recommended
            </h3>
            <v-row>
                <v-col
                    v-for="(result, i) in results"
                    :key="i"
                    cols="12"
                    sm="4"
                    md="4"
                    lg="4"
                    class="mx-xs-auto"
                >
                    <v-skeleton-loader
                        type="card-avatar"
                        :loading="loading"
                    >
                        <!-- <video-card
              :card="{ maxWidth: 350 }"
              :video="video"
              :channel="channel"
            ></video-card> -->
                        <v-card
                            class="card mb-10"
                            tile
                            flat
                            @click="generateVideo(i)"
                        >
                            <v-row no-gutters>
                                <v-col
                                    cols="12"
                                >
                                    <!-- <v-responsive max-height="100%"> -->
                                    <v-img
                                        class="align-center"
                                        :src="'https://api.computerender.com/generate/' + results[i].title"
                                    />
                                    <!-- </v-responsive> -->
                                </v-col>
                                <v-row>
                                    <v-col
                                        cols="12"
                                    >
                                        <div class="ml-2">
                                            <v-card-title
                                                class="pl-2 pt-0 subtitle-1 font-weight-bold"
                                            >
                                                {{ results[i].title }}
                                            </v-card-title>

                                            <!-- <v-card-subtitle
                                                class="pl-2 pt-2 pb-0"
                                                style="line-height: 1.2"
                                            >
                                                {{ results[i].title }}<br>
                                                9.6k views<v-icon>mdi-circle-small</v-icon>6 hours ago
                                            </v-card-subtitle> -->
                                            <v-card-subtitle class="pl-2 pt-2 pb-0">
                                                {{ results[i].description }}
                                            </v-card-subtitle>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-card>
                        <!-- <v-card
              class="content-bg card mx-auto"
              max-width="350"
              flat
              tile
              router
              to="/watch/12"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                height="200px"
              ></v-img>
              <v-row no-gutters>
                <v-col cols="2">
                  <v-list-item class="pl-0 pt-3" router to="/channels/12">
                    <v-list-item-avatar color="grey darken-3">
                      <v-img
                        class="elevation-6"
                        src="https://randomuser.me/api/portraits/men/1.jpg"
                      ></v-img>
                    </v-list-item-avatar>
                  </v-list-item>
                </v-col>
                <v-col>
                  <v-card-title class="pl-2 pt-3 subtitle-1 font-weight-bold">
                    Top western road trips
                  </v-card-title>

                  <v-card-subtitle class="pl-2 pb-0">
                    1,000 miles of wonder
                  </v-card-subtitle>
                  <v-card-subtitle class="pl-2 pt-0">
                    9.6k views<v-icon>mdi-circle-small</v-icon>6 hours ago
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card> -->
                    </v-skeleton-loader>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Client from '@/tt-api';
import videoCard from '@/components/VideoCard';

export default {
    name: 'Home',
    components: {
        videoCard,
    },
    data: () => ({
        loading: true,
        bottom: false,
        video: {
            url: '/watch/12',
            thumb: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
            title: 'Top western road trips',
            views: '9.6k',
            createdAt: '6 hours ago',
        },
        channel: {
            url: '/channels/12',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        results: [
            // {
            //     title: 'How to Create a Website in 10 Minutes',
            //     description: 'Learn how to create a website from scratch using easy-to-follow steps.',
            // },
            // {
            //     title: 'Photoshop Tutorial: How to Remove Background from Image',
            //     description: 'Watch and learn how to remove the background of an image in Photoshop in just a few steps.',
            // },
            // {
            //     title: 'Baking Basics: How to Make the Perfect Chocolate Chip Cookies',
            //     description: 'A step-by-step tutorial on how to make melt-in-your-mouth chocolate chip cookies.',
            // },
            // {
            //     title: 'Guitar Tutorial: How to Play Your First Song',
            //     description: 'Get started on your guitar journey with this easy first song tutorial.',
            // },
            // {
            //     title: 'How to Apply Makeup Like a Pro',
            //     description: 'Follow along as a professional makeup artist shows you how to create a flawless makeup look.',
            // },
            // {
            //     title: 'Illustrator Tutorial: How to Create a Vector Logo',
            //     description: 'Learn Adobe Illustrator basics and create a custom logo with this step-by-step tutorial.',
            // },
            // {
            //     title: 'Yoga Tutorial: How to Do Downward Facing Dog',
            //     description: 'A yoga instructor guides you through proper technique of the foundational yoga pose, Downward Facing Dog.',
            // },
            // {
            //     title: 'Python Tutorial: Build Your First Web Scraper',
            //     description: 'Follow this Python tutorial and build your very own web scraper from scratch.',
            // },
            /*
            {
                title: '10 Essential Soft Skills You Need To Master',
                description: 'Learn the top soft skills to enhance your work performance and impress your colleagues and bosses.',
            },
            {
                title: 'Effective Communication Skills Training',
                description: 'Get tips and techniques to improve your communication skills and become a more effective communicator.',
            },
            {
                title: 'Building Leadership Skills: A Comprehensive Guide',
                description: 'Learn how to develop effective leadership skills and motivate your team to achieve better results.',
            },
            {
                title: 'Time Management Techniques For Better Productivity',
                description: 'Get actionable tips to manage your time effectively and improve your productivity at work and in life.',
            },
            {
                title: 'Mastering Emotional Intelligence: Key to Personal and Professional Success',
                description: 'Learn how to develop Emotional Intelligence (EI) to enhance your relationships, communication and leadership skills.',
            },
            {
                title: 'Problem Solving Skills Training',
                description: 'Learn how to solve problems efficiently, using various tools and techniques, and achieve better outcomes.',
            },
            {
                title: 'Team Building Skills: Activities and Exercises',
                description: 'Discover fun and engaging team-building exercises to improve collaboration, communication, and trust among team members.',
            },
            {
                title: 'Effective Presentation Skills Training',
                description: 'Master the art of public speaking from preparation to delivery. Learn tips and tricks on how to give engaging presentations.',
            },
            {
                title: 'Top 10 Soft Skills to Develop in 2021',
                description: 'Learn the soft skills that will give you an edge in your career this year.',
            },
            {
                title: 'The Power of Listening: A Soft Skills Training',
                description: 'Improve your communication with this training on active listening.',
            },
            {
                title: 'Mastering Emotional Intelligence: A Soft Skills Guide',
                description: 'Learn to build stronger relationships and navigate challenging situations effectively.',
            },
            {
                title: 'Developing Critical Thinking: Soft Skills for Problem Solving',
                description: 'Hone your critical thinking skills with these expert tips.',
            },
            {
                title: 'Master Public Speaking with Soft Skills Training',
                description: 'Build confidence and captivate your audience with these public speaking tips.',
            },
            {
                title: 'Managing Conflict: Soft Skills for Healthy Relationships',
                description: 'Learn how to navigate conflict and build stronger relationships in both your personal and professional life.',
            },
            {
                title: 'Time Management Techniques: Soft Skills for Productivity',
                description: 'Maximize your time and productivity with these proven time management techniques.',
            },
            {
                title: 'Building a Team: Soft Skills for Effective Collaboration',
                description: 'Collaborate effectively and build strong, productive teams with these soft skills.',
            },
            {
                title: '10 Soft Skills You Need to Improve Your Career',
                description: 'Get ahead in your career by mastering these essential soft skills that employers are looking for.',
            },
            {
                title: 'Why Soft Skills Are Essential for Business Success',
                description: 'Learn why hard skills alone are not enough for a successful career and how soft skills can give you an edge.',
            },
            {
                title: 'How to Develop Your Soft Skills for Better Job Opportunities',
                description: 'Get practical tips and strategies for improving your soft skills and making yourself a more attractive candidate for employers.',
            },
            {
                title: 'Effective Communication Skills for the Workplace',
                description: 'Learn how to communicate more effectively with coworkers, clients, and supervisors using verbal and nonverbal techniques.',
            },
            {
                title: 'Developing Strong Leadership Skills for a Successful Career',
                description: 'Learn what it takes to be a great leader, including how to communicate, inspire, and motivate a team to achieve common goals.',
            },
            {
                title: 'Time Management Tips for Better Productivity',
                description: 'Master time management skills and increase your productivity in the workplace by setting goals, prioritizing tasks, and avoiding common time-wasters.',
            },
            {
                title: 'Problem-Solving Strategies for Better Decision Making',
                description: 'Learn how to analyze problems effectively and make smart decisions using critical thinking and problem-solving techniques.',
            },
            {
                title: 'Negotiation Skills for Successful Business Deals',
                description: 'Master the art of negotiation and learn how to achieve win-win outcomes in business deals using effective negotiation strategies.',
            },
*/

            {
                title: 'Safety Training Video for Workplace',
                description: 'Learn about workplace safety and prevent accidents. Essential for managers and employees.',
            },
            {
                title: 'Fire Safety Training',
                description: 'How to use fire extinguishers and evacuate in case of fire. A must-watch safety training video.',
            },
            {
                title: 'Construction Site Safety Training',
                description: 'Avoid accidents on construction sites by watching this safety training video.',
            },
            {
                title: 'OSHA Safety Training',
                description: 'Stay up-to-date with workplace safety regulations by attending this OSHA safety training course.',
            },
            {
                title: 'Electricity Safety Training',
                description: 'Learn how to stay safe around electricity with this engaging safety training video.',
            },
            {
                title: 'Forklift Safety Training',
                description: 'Avoid accidents with forklifts by watching this safety training video.',
            },
            {
                title: 'Chemical Safety Training',
                description: 'Stay safe while handling chemicals with this essential safety training video.',
            },
            {
                title: 'Kitchen Safety Training',
                description: 'Prevent accidents in the kitchen by watching this safety training video for food service employees.',
            },
            {
                title: 'OSHA Safety Training: How to Prevent Workplace Accidents',
                description: 'Learn safety best practices to keep your workplace safe and prevent accidents. Watch now!',
            },
            {
                title: 'Safety Training: Fire Safety in the Workplace',
                description: 'Understand the basics of fire prevention and safety in the workplace. Learn how to keep your employees safe.',
            },
            {
                title: 'Forklift Safety Training: OSHA Certification',
                description: 'Watch this comprehensive training to learn OSHA regulations and ensure your employees are certified and safe.',
            },
            {
                title: 'Safety Training: Electrical Safety for Non-Electricians',
                description: 'Stay safe around electricity! Learn the basics of electrical hazards and your responsibilities. Watch now.',
            },
            {
                title: 'Chemical Safety Training: Understanding MSDS',
                description: 'Keep your employees safe and comply with OSHA regulations. Watch this training to understand Material Safety Data Sheets (MSDS).',
            },
            {
                title: 'Construction Safety Training: The Basics',
                description: 'Ensure compliance with OSHA standards and prevent common construction accidents and injuries. Watch now.',
            },
            {
                title: 'Office Ergonomics Safety Training',
                description: 'Stay comfortable and safe at your desk! Learn office ergonomics and simple exercises to prevent injuries. Watch now.',
            },
            {
                title: 'Food Safety Training: Basics and Best Practices',
                description: 'Protect your employees and customers from foodborne illnesses. Learn food safety best practices from certified experts. Watch now.',
            },

        ]
        ,
    }),
    watch: {
        bottom(newValue) {
            if (newValue) {
                this.generateMoreSearchResults();
            }
        },
    },
    async mounted() {
        this.loading = false;

        window.addEventListener('scroll', () => {
            console.log(this.bottomVisible());
            this.bottom = this.bottomVisible();
        });
        // await this.generateMoreSearchResults();

        // this.loading = false;

    // setTimeout(() => {
    //   this.loading = false
    // }, 3000)
    },
    methods: {
        async generateMoreSearchResults() {
            console.log('generating more search results');
            const [result] = await Client.OpenAI.createChatCompletion([
                {
                    role: 'system',
                    content: `Generate 8 YouTube video titles and video descriptions from a prompt.
                Treat the prompt as if it is a search on YouTube.
                Provide 8 results regardless of the prompt.
                Video descriptions should be less than 120 characters
                Respond with the videos  in a JSON array in this format:
                [{title: <title>, description: <description>}...]
                
                It is important the array not have quotes around it`,
                },
                {
                    role: 'user',
                    content: 'Tutorial',
                },
            ]);
            console.log(result);
            this.results.push(...JSON.parse(result.message.content));
            console.log(this.results);

            // const splitResult = result.message.content
            //     .split('\n')
            //     .filter((s) => s.length)
            //     .map((s) => s.split(':'));
        },
        async generateVideo(index) {
            this.$router.push({ name: 'Watch', params: { id: index, title: this.results[index].title } });
        },
        bottomVisible() {
            console.log('scrolling');
            const { scrollY } = window;
            const visible = document.documentElement.clientHeight;
            const pageHeight = document.documentElement.scrollHeight;
            const bottomOfPage = visible + scrollY >= pageHeight;
            return bottomOfPage || pageHeight < visible;
        },
    },
};
</script>

<style lang="scss">
.card {
  background: #f9f9f9 !important;
}
</style>
