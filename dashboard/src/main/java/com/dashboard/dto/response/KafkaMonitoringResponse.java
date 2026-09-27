package com.dashboard.dto.response;

import java.util.List;

public record KafkaMonitoringResponse(

        boolean connected,

        String bootstrapServers,

        String clusterId,

        int brokerCount,

        List<TopicInfo> topics,

        List<ConsumerGroupInfo> consumerGroups,

        String checkedAt,

        String error

) {

    public record TopicInfo(

            String name,

            int partitions,

            int replicationFactor,

            long latestOffset

    ) {
    }


    public record ConsumerGroupInfo(

            String groupId,

            String state,

            int members,

            long lag

    ) {
    }
}