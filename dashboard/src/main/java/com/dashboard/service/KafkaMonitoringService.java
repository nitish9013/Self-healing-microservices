package com.dashboard.service;

import com.dashboard.dto.response.KafkaMonitoringResponse;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.ConsumerGroupListing;
import org.apache.kafka.clients.admin.ConsumerGroupDescription;
import org.apache.kafka.clients.admin.TopicDescription;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.TopicPartitionInfo;
//import org.apache.kafka.common.OffsetAndMetadata;
import org.apache.kafka.clients.admin.ListOffsetsResult;
import org.apache.kafka.clients.admin.OffsetSpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;

@Service
public class KafkaMonitoringService {

    @Value("${kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    @Value("${kafka.admin.request-timeout-ms:5000}")
    private String requestTimeoutMs;

    @Value("${kafka.admin.default-api-timeout-ms:5000}")
    private String defaultApiTimeoutMs;

    private AdminClient adminClient;


    @PostConstruct
    public void initialize() {

        Properties properties =
                new Properties();

        properties.put(
                AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG,
                bootstrapServers
        );

        properties.put(
                AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG,
                requestTimeoutMs
        );

        properties.put(
                AdminClientConfig.DEFAULT_API_TIMEOUT_MS_CONFIG,
                defaultApiTimeoutMs
        );

        adminClient =
                AdminClient.create(properties);
    }


    @PreDestroy
    public void shutdown() {

        if (adminClient != null) {
            adminClient.close(
                    java.time.Duration.ofSeconds(2)
            );
        }
    }


    public KafkaMonitoringResponse getKafkaStatus() {

        String checkedAt =
                Instant.now().toString();

        try {

            /*
             * ==========================================
             * CLUSTER
             * ==========================================
             */

            String clusterId =
                    adminClient
                            .describeCluster()
                            .clusterId()
                            .get(
                                    5,
                                    TimeUnit.SECONDS
                            );


            int brokerCount =
                    adminClient
                            .describeCluster()
                            .nodes()
                            .get(
                                    5,
                                    TimeUnit.SECONDS
                            )
                            .size();


            /*
             * ==========================================
             * TOPICS
             * ==========================================
             */

            Set<String> topicNames =
                    adminClient
                            .listTopics()
                            .names()
                            .get(
                                    5,
                                    TimeUnit.SECONDS
                            )
                            .stream()
                            .filter(
                                    name ->
                                            !name.startsWith("__")
                            )
                            .collect(
                                    java.util.stream.Collectors
                                            .toCollection(TreeSet::new)
                            );


            Map<String, TopicDescription>
                    topicDescriptions =
                    topicNames.isEmpty()
                            ? Collections.emptyMap()
                            : adminClient
                            .describeTopics(
                                    topicNames
                            )
                            .allTopicNames()
                            .get(
                                    5,
                                    TimeUnit.SECONDS
                            );


            List<KafkaMonitoringResponse.TopicInfo>
                    topics =
                    new ArrayList<>();


            for (String topicName :
                    topicNames) {

                TopicDescription description =
                        topicDescriptions.get(
                                topicName
                        );

                if (description == null) {
                    continue;
                }


                int partitions =
                        description
                                .partitions()
                                .size();


                int replicationFactor =
                        description
                                .partitions()
                                .stream()
                                .findFirst()
                                .map(
                                        TopicPartitionInfo::replicas
                                )
                                .map(
                                        List::size
                                )
                                .orElse(0);


                long latestOffset =
                        getLatestOffset(
                                description
                        );


                topics.add(
                        new KafkaMonitoringResponse
                                .TopicInfo(
                                topicName,
                                partitions,
                                replicationFactor,
                                latestOffset
                        )
                );
            }


            /*
             * ==========================================
             * CONSUMER GROUPS
             * ==========================================
             */

            List<ConsumerGroupListing>
                    groupListings =
                    (List<ConsumerGroupListing>) adminClient
                            .listConsumerGroups()
                            .all()
                            .get(
                                    5,
                                    TimeUnit.SECONDS
                            );


            List<String> groupIds =
                    groupListings
                            .stream()
                            .map(
                                    ConsumerGroupListing::groupId
                            )
                            .sorted()
                            .toList();


            List<KafkaMonitoringResponse
                    .ConsumerGroupInfo>
                    consumerGroups =
                    new ArrayList<>();


            if (!groupIds.isEmpty()) {

                Map<String,
                        ConsumerGroupDescription>
                        groupDescriptions =
                        adminClient
                                .describeConsumerGroups(
                                        groupIds
                                )
                                .all()
                                .get(
                                        5,
                                        TimeUnit.SECONDS
                                );


                for (String groupId :
                        groupIds) {

                    ConsumerGroupDescription
                            group =
                            groupDescriptions
                                    .get(groupId);

                    if (group == null) {
                        continue;
                    }


                    String state =
                            group.state()
                                    .toString();


                    int members =
                            group.members()
                                    .size();


                    long lag =
                            calculateGroupLag(
                                    groupId
                            );


                    consumerGroups.add(
                            new KafkaMonitoringResponse
                                    .ConsumerGroupInfo(
                                    groupId,
                                    state,
                                    members,
                                    lag
                            )
                    );
                }
            }


            return new KafkaMonitoringResponse(
                    true,
                    bootstrapServers,
                    clusterId,
                    brokerCount,
                    topics,
                    consumerGroups,
                    checkedAt,
                    null
            );


        } catch (Exception exception) {

            return new KafkaMonitoringResponse(
                    false,
                    bootstrapServers,
                    null,
                    0,
                    Collections.emptyList(),
                    Collections.emptyList(),
                    checkedAt,
                    exception.getMessage()
            );
        }
    }


    private long getLatestOffset(
            TopicDescription description
    ) {

        try {

            Map<TopicPartition, OffsetSpec>
                    requests =
                    new HashMap<>();


            for (
                    TopicPartitionInfo partition :
                    description.partitions()
            ) {

                TopicPartition topicPartition =
                        new TopicPartition(
                                description.name(),
                                partition.partition()
                        );


                requests.put(
                        topicPartition,
                        OffsetSpec.latest()
                );
            }


            Map<TopicPartition,
                    ListOffsetsResult
                            .ListOffsetsResultInfo>
                    offsets =
                    adminClient
                            .listOffsets(requests)
                            .all()
                            .get(
                                    5,
                                    TimeUnit.SECONDS
                            );


            return offsets
                    .values()
                    .stream()
                    .mapToLong(
                            ListOffsetsResult
                                    .ListOffsetsResultInfo
                                    ::offset
                    )
                    .sum();

        } catch (Exception exception) {

            return 0;
        }
    }


    private long calculateGroupLag(
            String groupId
    ) {

        try {

            Map<TopicPartition,
                    OffsetAndMetadata>
                    committedOffsets =
                    adminClient
                            .listConsumerGroupOffsets(
                                    groupId
                            )
                            .partitionsToOffsetAndMetadata()
                            .get(
                                    5,
                                    TimeUnit.SECONDS
                            );


            if (committedOffsets.isEmpty()) {
                return 0;
            }


            Map<TopicPartition,
                    OffsetSpec>
                    latestRequests =
                    new HashMap<>();


            for (
                    TopicPartition partition :
                    committedOffsets.keySet()
            ) {

                latestRequests.put(
                        partition,
                        OffsetSpec.latest()
                );
            }


            Map<TopicPartition,
                    ListOffsetsResult
                            .ListOffsetsResultInfo>
                    latestOffsets =
                    adminClient
                            .listOffsets(
                                    latestRequests
                            )
                            .all()
                            .get(
                                    5,
                                    TimeUnit.SECONDS
                            );


            long totalLag = 0;


            for (
                    Map.Entry<
                            TopicPartition,
                            OffsetAndMetadata
                            > entry :
                    committedOffsets.entrySet()
            ) {

                TopicPartition partition =
                        entry.getKey();


                long committed =
                        entry.getValue()
                                .offset();


                ListOffsetsResult
                        .ListOffsetsResultInfo
                        latest =
                        latestOffsets.get(
                                partition
                        );


                if (latest == null) {
                    continue;
                }


                long endOffset =
                        latest.offset();


                totalLag += Math.max(
                        0,
                        endOffset - committed
                );
            }


            return totalLag;

        } catch (Exception exception) {

            return 0;
        }
    }
}